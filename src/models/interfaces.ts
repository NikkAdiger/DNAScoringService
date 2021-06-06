export interface IResponseData {
    status: string,
    message: string,
    results: string[],
    error?: any
}

export interface ICash {
    validation: string,
    seqGCRatio?: number,
    subSeqDif?: number,
}