import { Request, Response, NextFunction } from 'express';
import { listCompanies } from '../src/controllers/CompanyController';
import db from '../db/db';

describe('listCompanies controller', () => {
    it('should list all companies', async () => {
        const req = {} as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;
        const next = jest.fn() as NextFunction;

        const mockRows = [
            { id: 1, name: 'Company 1' },
            { id: 2, name: 'Company 2' },
        ];
        db.query = jest.fn().mockResolvedValue({ rows: mockRows });

        await listCompanies(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockRows);
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle error while listing companies', async () => {
        const req = {} as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;
        const next = jest.fn() as NextFunction;

        const mockError = new Error('Database error');
        db.query = jest.fn().mockRejectedValue(mockError);

        await listCompanies(req, res, next);

        expect(next).toHaveBeenCalledWith(mockError);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});
