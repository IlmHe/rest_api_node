import { Client } from 'pg';

// Since this is a demo project, environment variables are hardcoded here for simplicity.
// In a real-world application, consider using environment files or other secure methods for managing secrets.

const client = new Client({
    user: 'myuser',
    password: 'mysecretpassword',
    host: 'localhost',
    port: 5432,
    database: 'mydb',
});

client.connect()
    .then(() => {
        console.log('Connected to the database');
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS companies (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                contact_email TEXT,
                company_website TEXT,
                company_business_id TEXT,
                street_address TEXT,
                phone_number TEXT
            );
        `;
        return client.query(createTableQuery);
    })
    .then(() => {
        console.log('Companies table created (or exists already))');
    })
    .catch((error) => {
        console.error('Error connecting to the database:', error);
    });

export default client;
