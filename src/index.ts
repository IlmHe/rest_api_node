import express from 'express';
import bodyParser from 'body-parser';
import companyRouter from './routes/CompanyRoutes';
import {errorHandler} from "./middlewares/ErrorHandler";

const app = express();

app.use(bodyParser.json());
app.use('/api', companyRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
