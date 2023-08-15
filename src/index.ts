import * as express from 'express';
import * as bodyParser from 'body-parser';
import companyRouter from './routes/CompanyRoutes';

const app = express();

app.use(bodyParser.json());
app.use('/api', companyRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
