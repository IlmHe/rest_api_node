import { Request, Response, NextFunction } from 'express';
import { createCompany } from '../src/controllers/CompanyController';

describe('createCompany controller', () => {

    it('should handle missing name', async () => {
        const req = {
            body: {},
        } as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await createCompany(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Company name is required' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle invalid contact email', async () => {
        const req = {
            body: {
                name: 'Test Company',
                contactEmail: 'invalid-email',
            },
        } as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await createCompany(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Contact email is invalid' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle read-only fields', async () => {
        const req = {
            body: {
                name: 'Test Company',
                streetAddress: 'New Address',
            },
        } as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await createCompany(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'streetAddress and phoneNumber fields are read-only' });
        expect(next).not.toHaveBeenCalled();
    });
});
