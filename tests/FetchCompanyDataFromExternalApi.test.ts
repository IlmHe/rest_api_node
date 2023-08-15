import axios from 'axios';
import { fetchCompanyDataFromExternalApi } from '../src/services/ExternalApiService';

jest.mock('axios');

describe('fetchCompanyDataFromExternalApi', () => {
    it('should fetch and return company data from the external API', async () => {
        const mockApiResponse = {
            streetAddress: {
                street: { value: 'Mock Street' },
                city: { value: 'Mock City' },
                postalCode: { value: '12345' },
            },
            phone: { value: '123456789' },
        };

        const axiosGetSpy = jest.spyOn(axios, 'get');
        axiosGetSpy.mockResolvedValue({ data: mockApiResponse });

        const companyBusinessID = 'mock-business-id';
        const result = await fetchCompanyDataFromExternalApi(companyBusinessID);

        expect(result).toEqual({
            streetAddress: 'Mock Street, 12345, Mock City',
            phoneNumber: '+35823456789',
        });
    });

    it('should handle missing properties in API response', async () => {
        const mockApiResponse = {};

        const axiosGetSpy = jest.spyOn(axios, 'get');
        axiosGetSpy.mockResolvedValue({ data: mockApiResponse });

        const companyBusinessID = 'mock-business-id';
        await expect(fetchCompanyDataFromExternalApi(companyBusinessID)).rejects.toThrow('Required properties missing in API response.');
    });


    it('should handle non-axios error', async () => {
        const mockApiResponse = {
            streetAddress: {
                street: { value: 'Mock Street' },
                city: { value: 'Mock City' },
                postalCode: { value: '12345' },
            },
            phone: { value: '123456789' },
        };

        const mockError = new Error('Mock Non-Axios Error');

        const axiosGetSpy = jest.spyOn(axios, 'get');
        axiosGetSpy.mockResolvedValue({ data: mockApiResponse });

        const companyBusinessID = 'mock-business-id';
        axiosGetSpy.mockImplementation(() => {
            throw mockError;
        });

        await expect(fetchCompanyDataFromExternalApi(companyBusinessID)).rejects.toEqual(mockError);

        axiosGetSpy.mockRestore();
    });

});
