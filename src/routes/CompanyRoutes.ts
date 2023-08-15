import express from 'express';
import { createCompany, listCompanies, getCompany, deleteCompany } from '../controllers/CompanyController';

const companyRouter = express.Router();

companyRouter.post('/companies', createCompany);
companyRouter.get('/companies', listCompanies);
companyRouter.get('/companies/:companyBusinessID', getCompany);
companyRouter.delete('/companies/:companyBusinessID', deleteCompany);

export default companyRouter;
