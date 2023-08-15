import {NextFunction, Request, Response} from 'express';
import {Company} from '../models/Company';
import {fetchCompanyDataFromExternalApi} from '../services/ExternalApiService';
import isEmail from 'validator/lib/isEmail';
import db from '../../db/db';

/**
 * @openapi
 * /companies:
 *   post:
 *     summary: Create a new company
 *     tags:
 *       - Companies
 *     requestBody:
 *       description: Company data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyInput'
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       400:
 *         description: Bad request
 */
export const createCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, contactEmail, companyWebsite, companyBusinessID, streetAddress, phoneNumber }: Company = req.body;
        if (streetAddress || phoneNumber) {
            return res.status(400).json({ error: 'streetAddress and phoneNumber fields are read-only' });
        }
        if (!name) {
            return res.status(400).json({ error: 'Company name is required' });
        }
        if (contactEmail && !isEmail(contactEmail)) {
            return res.status(400).json({ error: 'Contact email is invalid' });
        }

        let additionalData: { streetAddress?: string; phoneNumber?: string } = {};
        if (companyBusinessID) {
            additionalData = await fetchCompanyDataFromExternalApi(companyBusinessID);
        }

        const insertQuery = `
            INSERT INTO companies (name, contact_email, company_website, company_business_id, street_address, phone_number)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`;
        const values = [name, contactEmail, companyWebsite, companyBusinessID, additionalData.streetAddress, additionalData.phoneNumber];
        const result = await db.query(insertQuery, values);
        const newCompany: Company = result.rows[0];
        return res.status(201).json(newCompany);
    } catch (error) {
        console.error('Error creating company:', error);
        next(error);
    }
};

/**
 * @openapi
 * /companies:
 *   get:
 *     summary: List all companies
 *     tags:
 *       - Companies
 *     responses:
 *       200:
 *         description: List of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 */
export const listCompanies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = 'SELECT * FROM companies';
        const result = await db.query(query);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error listing companies.');
        next(error);
    }
};

/**
 * @openapi
 * /companies/{companyBusinessID}:
 *   get:
 *     summary: Get a company by ID
 *     tags:
 *       - Companies
 *     parameters:
 *       - name: companyBusinessID
 *         in: path
 *         description: ID of the company to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
 */

export const getCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companyBusinessID: string | undefined = req.params.companyBusinessID;
        if (!companyBusinessID) {
            return res.status(400).json({ error: 'Company ID is missing' });
        }

        const selectQuery = 'SELECT * FROM companies WHERE company_business_id = $1';
        const result = await db.query(selectQuery, [companyBusinessID]);

        const foundCompany: Company = result.rows[0];
        if (!foundCompany) {
            return res.status(404).json({ error: 'Company not found' });
        }

        return res.status(200).json(foundCompany);
    } catch (error) {
        console.error('Error getting company:', error);
        next(error);
    }
};

/**
 * @openapi
 * /companies/{companyBusinessID}:
 *   delete:
 *     summary: Delete a company by ID
 *     tags:
 *       - Companies
 *     parameters:
 *       - name: companyBusinessID
 *         in: path
 *         description: ID of the company to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *       404:
 *         description: Company not found
 */
export const deleteCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companyBusinessID: string | undefined = req.params.companyBusinessID;
        if (!companyBusinessID) {
            return res.status(400).json({ error: 'Company ID is missing' });
        }
        const deleteQuery = 'DELETE FROM companies WHERE company_business_id = $1 RETURNING *';
        const result = await db.query(deleteQuery, [companyBusinessID]);

        const deletedCompany: Company = result.rows[0];
        if (!deletedCompany) {
            return res.status(404).json({ error: 'Company not found' });
        }

        return res.status(200).json(deletedCompany);
    } catch (error) {
        console.error('Error deleting company:', error);
        next(error);
    }
};

