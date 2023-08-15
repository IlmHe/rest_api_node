import { Client } from 'pg';

describe('Database Initialization', () => {
    it('should connect to the database and create the companies table', async () => {
        const testClient = new Client({
            user: 'myuser',
            password: 'mysecretpassword',
            host: 'localhost',
            port: 5432,
            database: 'mydb',
        });

        try {
            await testClient.connect();
            console.log('Connected to the test database');

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
            await testClient.query(createTableQuery);
            console.log('Companies table created in the test database');

            const result = await testClient.query('SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = \'companies\')');
            const tableExists = result.rows[0].exists;
            expect(tableExists).toBeTruthy();

        } catch (error) {
            console.error('Error connecting to the test database:', error);
            fail('Error connecting to the test database');
        } finally {
            await testClient.end();
        }
    });

});
