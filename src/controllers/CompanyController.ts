import { Request, Response } from 'express';
import { Company } from '../models/Company';
import companies from '../DataStore';

export const createCompany = (req: Request, res: Response) => {
    try {
        const newCompany: Company = { ...req.body };
        companies.push(newCompany);
        console.log('New Company:', newCompany);
        res.status(201).json(newCompany);
        console.log(`Created company ${req.body.name}`);
    } catch (error) {
        console.error('Error creating company:', error);
        res.status(500).json({ error: 'An error occurred while creating the company' });
    }
};

export const listCompanies = (req: Request, res: Response) => {
    // Implement list companies logic here
};

export const getCompany = async (req: Request, res: Response) => {
    // Implement get company logic here
};

export const deleteCompany = (req: Request, res: Response) => {
    // Implement delete company logic here
};
