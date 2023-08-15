
# Node Express API with TypeScript

This is a sample Node.js Express API built using TypeScript. The API manages company data, allowing you to create, list, retrieve, and delete company information.

## Running
- After cloning the repo, install dependencies
``` $ npm install ```
- Make sure you're in the src directory, start the application using ts-node
``` $ ts-node index.ts ```
- To run the Postgres db, go to the root directory and run:
``` $ docker-compose up -d ```

## OpenAPI Documentation

The API is documented using OpenAPI. You can access the documentation by visiting http://localhost:3000/api-docs when the application is running. This documentation provides details about available endpoints, request/response structures, and example requests.

### Explanations
- Controllers: They handle incoming HTTP requests, validate data, interact with the database, and manage errors that might occur during processing
- Middlewares (error handler): designed to handle errors that occur during the processing of incoming HTTP requests
- Routes: Express router that maps each route to its corresponding Controller function
- Services (ExternalApiService): Fetches data from an external API, formats and handles error scenarios
- db: Establishes connection with the database, creates it, and exports it. Uses promises to handle async operations

### Remarks
- Middleware error handling to improve readability
- Decided to use database instead of in-memory to make it more similiar to real life applications
- swagger-ui-express to unite everything into one applicaton

### Bonus Question
- Containerize the application
- Push Docker Image to Amazon ECR
- Set Up Amazon RDS for PostgreSQL
- Deploy Application to AWS Fargate
- Load balancing
- **GCP version:**
- Containerize the application
- Push Docker Image to Container Registry
- Set Up Cloud SQL for PostgreSQL
- Deploy Application to Google Cloud Run
- Load balancing
