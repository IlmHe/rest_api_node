import express from 'express';
import bodyParser from 'body-parser';
import companyRouter from './routes/CompanyRoutes';
import {errorHandler} from "./middlewares/ErrorHandler";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(bodyParser.json());
app.use(companyRouter);
app.use(errorHandler);


const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node Express API with TypeScript',
            version: '1.0.0',
        },
        components: {
            schemas: {
                CompanyInput: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', example: 'Alma Media Oy' },
                        contactEmail: { type: 'string', example: 'alma@email.com' },
                        companyWebsite: { type: 'string', example: 'https://www.almamedia.fi' },
                        companyBusinessID: { type: 'string', example: '1944757-4' },
                    },
                },
                Company: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Alma Media Oy' },
                        contactEmail: { type: 'string', example: 'alma@email.com' },
                        companyWebsite: { type: 'string', example: 'https://www.almamedia.fi' },
                        companyBusinessID: { type: 'string', example: '1944757-4' },
                        streetAddress: { type: 'string', example: 'Alvar Aallon katu 3 C, 00100, HELSINKI' },
                        phoneNumber: { type: 'string', example: '+35810665000' },
                    },
                },
            },
        },
    },

    apis: ['./controllers/CompanyController.ts'],
};
const openapiSpecification = swaggerJsdoc(options);
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(openapiSpecification);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
