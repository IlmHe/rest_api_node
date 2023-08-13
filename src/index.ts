import * as express from 'express';
import * as bodyParser from 'body-parser';
import companyRoutes from './routes/CompanyRoutes';

const app = express();

app.use(bodyParser.json());
app.use('/api', companyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
