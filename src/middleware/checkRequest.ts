import { Request, Response, NextFunction } from 'express';

export default function checkRequest(req: Request, res: Response, next: NextFunction): any {
    return next();
} 