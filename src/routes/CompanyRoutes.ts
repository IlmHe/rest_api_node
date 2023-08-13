import * as express from 'express';
import { createCompany, listCompanies, getCompany, deleteCompany } from '../controllers/CompanyController';

const router = express.Router();

router.post('/companies', createCompany);
router.get('/companies', listCompanies);
router.get('/companies/:companyId', getCompany);
router.delete('/companies/:companyId', deleteCompany);

export default router;
