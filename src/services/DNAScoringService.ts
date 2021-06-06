import { Request } from 'express';
import * as env from '../config';
import { ICash } from '../models/interfaces';
import fs from 'fs';

export function saveDataToFile (req: Request, file: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(file);

        writeStream
            .on('error', (error) => {
                console.error(error);
                reject(error);
            })
            .on('finish', () => {
                console.log(`WriteStream finished`);
            })
            .on('close', () => {
                console.log(`WriteStream completed`);
                resolve();
            });

        req.on('error', (error) => {
                console.error(error);
                reject(error);
            })
            .on('end', () => {
                console.log(`Request ended`);
            })
            .on('close', () => {
                console.log(`Request completed`);
            });

        req.pipe(writeStream);

    })
}

export function scoringGCRatio(sequence: string): ICash {
    const extendedCharacters = env.environment.dnaSymbols;

    let countCGSequence = 0;
    let countCGSubSequence = 0;

    const { subSequenceLength } = env.environment.subSequenceGCRatio;
    let minGCRatioSubSequence = 0;
    let maxGCRatioSubSequence = 0;
    const result: ICash = {
        validation: 'invalid',
        seqGCRatio: 0,
        subSeqDif: 0
    };

    for (let i = 0; i < sequence.length; i++) {
        if(!extendedCharacters[sequence[i]]) return result;
        if(sequence[i] === 'G' || sequence[i] === 'C') {
            countCGSequence++;
            countCGSubSequence++;
        }
        if(i%subSequenceLength === 0) {
            let ratioCG = countCGSubSequence / subSequenceLength;
            if(ratioCG > maxGCRatioSubSequence) maxGCRatioSubSequence = ratioCG;
            if(ratioCG < minGCRatioSubSequence || minGCRatioSubSequence === 0) minGCRatioSubSequence = ratioCG;
            countCGSubSequence = 0;
        }
    };

    result.seqGCRatio = countCGSequence / sequence.length;
    result.subSeqDif = (maxGCRatioSubSequence - minGCRatioSubSequence) / minGCRatioSubSequence;
    result.validation = 'valid';

    return result;
}