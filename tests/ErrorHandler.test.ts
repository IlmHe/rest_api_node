import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';
import { errorHandler } from '../src/middlewares/ErrorHandler';


describe('errorHandler', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    it('should handle ValidationError and respond with 400', () => {
        const mockValidationError = new ValidationError('Validation error message', [], 'value');
        errorHandler(mockValidationError, mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Validation error message' });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle generic error and respond with 500', () => {
        const mockError = new Error('Generic error');
        errorHandler(mockError, mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred' });
        expect(mockNext).not.toHaveBeenCalled();
    });
});
