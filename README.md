
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
