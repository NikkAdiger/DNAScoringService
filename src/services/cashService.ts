// this is service have been needs for duplicate sequence test and save results
import { ICash } from '../models/interfaces';

// Database instead of Redis
const dbCash = {};

export async function getSequence(sequence: string): Promise<ICash> {
    let result: ICash = dbCash[`${sequence}`];
    if(result) console.log(`Sequence have duplicate, result received from Cash`, result);
    return Promise.resolve(result);
}

export async function putSequence(sequence: string, data: ICash): Promise<ICash> {
    // Put results in Cash
    dbCash[`${sequence}`] = data;
    console.log(`Sequence have been add in Cash`);
    return Promise.resolve(data);
}