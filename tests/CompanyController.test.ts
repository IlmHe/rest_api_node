import { Request, Response, NextFunction } from 'express';
import { getCompany } from '../src/controllers/CompanyController';
import db from '../db/db';

describe('getCompany controller', () => {
    it('should get a company by ID', async () => {
        const req = {
            params: {
                companyBusinessID: '12345',
            },
        } as unknown as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;
        const next = jest.fn() as NextFunction;

        const mockCompany = { id: 1, name: 'Test Company' };
        db.query = jest.fn().mockResolvedValue({ rows: [mockCompany] });

        await getCompany(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockCompany);
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle missing company ID', async () => {
        const req = {
            params: {},
        } as unknown as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await getCompany(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Company ID is missing' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle company not found', async () => {
        const req = {
            params: {
                companyBusinessID: '12345',
            },
        } as unknown as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;
        const next = jest.fn() as NextFunction;

        db.query = jest.fn().mockResolvedValue({ rows: [] });

        await getCompany(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Company not found' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle database error', async () => {
        const req = {
            params: {
                companyBusinessID: '12345',
            },
        } as unknown as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;
        const next = jest.fn() as NextFunction;

        const mockError = new Error('Database error');
        db.query = jest.fn().mockRejectedValue(mockError);

        await getCompany(req, res, next);

        expect(next).toHaveBeenCalledWith(mockError);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});
