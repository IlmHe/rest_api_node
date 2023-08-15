import {NextFunction, Request, Response} from 'express';
import {Company} from '../models/Company';
import companiesArr from '../DataStore';
import {fetchCompanyDataFromExternalApi} from '../services/ExternalApiService';
import isEmail from 'validator/lib/isEmail';


export const createCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {name, contactEmail, companyWebsite, companyBusinessID, streetAddress, phoneNumber}: Company = req.body;
        if (streetAddress || phoneNumber) {
            return res.status(400).json({error: 'streetAddress and phoneNumber fields are read-only'});
        }
        if (!name) {
            return res.status(400).json({error: 'Company name is required'});
        }
        if (contactEmail && !isEmail(contactEmail)) {
            return res.status(400).json({ error: 'Contact email is invalid' });
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
        return res.status(201).json(newCompany);
    } catch (error) {
        console.error('Error creating company.');
        next(error);
    }
};

export const listCompanies = (req: Request, res: Response, next: NextFunction) => {
    try {
        const allCompanies: Company[] = companiesArr;
        return res.status(200).json(allCompanies);
    } catch (error) {
        console.error('Error listing companies.');
        next(error);
    }
};

export const getCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companyBusinessID: string | undefined = req.params.companyBusinessID;
        if (!companyBusinessID) {
            return res.status(400).json({error: 'Company ID is missing'});
        }
        const foundCompany: Company | undefined = companiesArr.find(company => company.companyBusinessID === companyBusinessID);
        if (!foundCompany) {
            return res.status(404).json({error: 'Company not found'});
        }
        return res.status(200).json(foundCompany);
    } catch (error) {
        console.error('Error getting company.');
        next(error);
    }
};


export const deleteCompany = (req: Request, res: Response, next: NextFunction) => {
    try {
        const companyBusinessID: string | undefined = req.params.companyBusinessID;
        if (!companyBusinessID) {
            return res.status(400).json({error: 'Company ID is missing'});
        }
        const indexToDelete: number = companiesArr.findIndex(company => company.companyBusinessID === companyBusinessID);
        if (indexToDelete === -1) {
            return res.status(404).json({error: 'Company not found'});
        }
        const deletedCompany: Company | undefined = companiesArr.splice(indexToDelete, 1)[0];
        return res.status(200).json(deletedCompany);
    } catch (error) {
        console.error('Error deleting company.');
        next(error);
    }
};

