import { Request, Response } from 'express';
import JSONStream from 'JSONStream';
import { ICash, IResponseData } from '../models/interfaces';
import * as DNAService from '../services/DNAScoringService';
import * as cashService from '../services/cashService';
import * as env from '../config';
import path from 'path';
import fs from 'fs';

export async function checkDNA(req: Request, res: Response): Promise<void> {

    try {

        const fileName = `tmp-${uuidv4()}.json`;
        let filePath = path.join(env.environment.tempFolder, fileName);    
   
        // Since there can be a lot of data (gigabytes), we will write it to disk in a textfile
        // One sequence on a separate line
        await DNAService.saveDataToFile(req, filePath);

        const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
        const parser = JSONStream.parse('*');

        // const checksArray: Promise<string>[] = [];
        const results: string[] = [];

        readStream.pipe(parser)
            .on('data', async (data) => {
                data.forEach(async element => {
                    // checksArray.push(checkSequence(element));
                    results.push(await checkSequence(element));
                });
            })
            .on('end', async () => {
                console.log(`JSONStream parsing complete`);
                // let results = await Promise.all(checksArray);
                const response: IResponseData = {
                    status: 'complete',
                    message: 'gene scoring finished successfully',
                    results
                }
                res.status(200).send(response);
            })        
    } catch (error) {
        const response: IResponseData = {
            status: 'failed',
            message: 'generate scoring failed',
            results: [],
            error: error.message
        }
        res.status(500).send(response);
    }
}

async function checkSequence(sequence: string): Promise<string> {

    const { environment } = env;

    //Basic check for length, no need to do anything immediately return invalid
    if(sequence.length < environment.validation.minLength || sequence.length > environment.validation.maxLength) {
        return Promise.resolve('invalid'); 
    }

    //The second check for a duplicate, if there are duplicate, the result will be received from Cash
    let result: ICash = await cashService.getSequence(sequence);
    if(result) return Promise.resolve(result.validation);

    //Validate expected characters and scoring GCRatio
    result = DNAService.scoringGCRatio(sequence);

    if(result.validation === 'invalid') {
        // Save results in Cash 
        await cashService.putSequence(sequence, result);
        return Promise.resolve(result.validation);
    }

    //Check GCRatio
    if(result.seqGCRatio < environment.sequenceGCRatio.min || result.seqGCRatio > environment.sequenceGCRatio.max) {
        result.validation = 'invalid';
    }

    //Check difference GCRatio in sub-sequence
    if(result.subSeqDif  > environment.subSequenceGCRatio.maxDifference) {
        result.validation = 'invalid';
    }

    // Save results in Cash 
    await cashService.putSequence(sequence, result);

    return Promise.resolve(result.validation);
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}