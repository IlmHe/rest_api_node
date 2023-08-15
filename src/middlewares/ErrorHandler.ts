import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('An error occurred:', error);

    if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'An unexpected error occurred' });
};
