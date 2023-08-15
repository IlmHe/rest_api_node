import {Request, Response} from 'express';
import {Company} from '../models/Company';
import companiesArr from '../DataStore';
import {fetchCompanyDataFromExternalApi} from '../services/ExternalApiService';

export const createCompany = async (req: Request, res: Response) => {
    try {
        const {name, contactEmail, companyWebsite, companyBusinessID}: Company = req.body;
        if (!name) {
            res.status(400).json({error: 'Company name is required'});
            return;
        }
        let additionalData: { streetAddress?: string; phoneNumber?: string } = {};
        if (companyBusinessID) {
            additionalData = await fetchCompanyDataFromExternalApi(companyBusinessID);
        }
        const newCompany: Company = {
            name,
            contactEmail,
            companyWebsite,
            companyBusinessID,
            ...additionalData
        };
        companiesArr.push(newCompany);
        console.log('New Company:', newCompany);
        res.status(201).json(newCompany);
        console.log(`Created company ${name}`);
    } catch (error) {
        console.error('Error creating company:', error);
        res.status(500).json({error: 'An error occurred while creating the company'});
    }
};


export const listCompanies = (req: Request, res: Response) => {
    try {
        const allCompanies: Company[] = companiesArr;
        res.status(200).json(allCompanies);
    } catch (error) {
        console.error('Error listing companies:', error);
        res.status(500).json({error: 'An error occurred while listing companies'});
    }
};


export const getCompany = async (req: Request, res: Response) => {
    try {
        const companyBusinessID: string | undefined = req.params.companyBusinessID;
        if (!companyBusinessID) {
            res.status(400).json({error: 'Company ID is missing'});
            return;
        }
        const foundCompany: Company | undefined = companiesArr.find(company => company.companyBusinessID === companyBusinessID);
        if (!foundCompany) {
            res.status(404).json({error: 'Company not found'});
            return;
        }
        res.status(200).json(foundCompany);
    } catch (error) {
        console.error('Error getting company:', error);
        res.status(500).json({error: 'An error occurred while getting the company'});
    }
};


export const deleteCompany = (req: Request, res: Response) => {
    try {
        const companyBusinessID: string | undefined = req.params.companyBusinessID;
        if (!companyBusinessID) {
            res.status(400).json({error: 'Company ID is missing'});
            return;
        }
        const indexToDelete: number = companiesArr.findIndex(company => company.companyBusinessID === companyBusinessID);
        if (indexToDelete === -1) {
            res.status(404).json({error: 'Company not found'});
            return;
        }
        const deletedCompany: Company | undefined = companiesArr.splice(indexToDelete, 1)[0];
        res.status(200).json(deletedCompany);
    } catch (error) {
        console.error('Error deleting company:', error);
        res.status(500).json({error: 'An error occurred while deleting the company'});
    }
};

