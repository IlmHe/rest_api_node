import { Request, Response, NextFunction } from 'express';
import { deleteCompany } from '../src/controllers/CompanyController';
import db from '../db/db';

describe('deleteCompany controller', () => {
    it('should delete a company', async () => {
        const req = { params: { companyBusinessID: 'example-id' } } as unknown as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;
        const next = jest.fn() as NextFunction;

        const mockDeletedCompany = { id: 1, name: 'Deleted Company' };
        db.query = jest.fn().mockResolvedValue({ rows: [mockDeletedCompany] });

        await deleteCompany(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockDeletedCompany);
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle missing company ID', async () => {
        const req = { params: {} } as unknown as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await deleteCompany(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Company ID is missing' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle company not found', async () => {
        const req = { params: { companyBusinessID: 'non-existent-id' } } as unknown as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;
        const next = jest.fn() as NextFunction;

        db.query = jest.fn().mockResolvedValue({ rows: [] });

        await deleteCompany(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Company not found' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors during deletion', async () => {
        const mockError = new Error('Mock Database Error');

        const req = { params: { companyBusinessID: 'example-id' } } as unknown as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;
        const next = jest.fn() as NextFunction;

        db.query = jest.fn().mockRejectedValue(mockError);

        const consoleErrorMock = jest.spyOn(console, 'error');

        await deleteCompany(req, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(mockError);

        expect(consoleErrorMock).toHaveBeenCalledWith('Error deleting company:', mockError);

        consoleErrorMock.mockRestore();
    });
});
