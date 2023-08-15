import axios, {AxiosError} from 'axios';

interface CompanyApiResponse {
    streetAddress?: {
        street?: { value: string };
        city?: { value: string };
        postalCode?: { value: string };
    };
    phone?: { value: string };
}

/**
 * Fetches company data from an external API based on the companyBusinessID.
 * @param {string} companyBusinessID - The business ID of the company.
 * @returns {Promise<{ streetAddress?: string; phoneNumber?: string }>} A promise containing the street address and phone number of the company.
 */
export async function fetchCompanyDataFromExternalApi(companyBusinessID: string): Promise<{ streetAddress?: string; phoneNumber?: string }> {
    const externalApiUrl = `https://www.kauppalehti.fi/company-api/basic-info/${companyBusinessID}`;
    const headers = {
        'User-Agent': 'curl/8.2.1'
    };

    try {
        const response = await axios.get<CompanyApiResponse>(externalApiUrl, {headers});
        const externalData = response.data;

        const street = externalData.streetAddress?.street?.value;
        const postalCode = externalData.streetAddress?.postalCode?.value;
        const city = externalData.streetAddress?.city?.value;
        let phoneNumber = externalData.phone?.value;

        if (street && postalCode && city && phoneNumber) {
            const streetAddress = `${street}, ${postalCode}, ${city}`;
            phoneNumber = '+358' + phoneNumber.slice(1);
            return {streetAddress, phoneNumber};
        } else {
            throw new Error('Required properties missing in API response.');
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            const errorMessage = axiosError.message;
            const responseData = axiosError.response?.data;
            const responseStatus = axiosError.response?.status;
            console.error('Error fetching data from external API:', errorMessage);
            if (responseData && responseStatus) {
                console.error('Response data:', responseData);
                console.error('Response status:', responseStatus);
            }
            return Promise.reject(error);
        } else {
            return Promise.reject(error);
        }
    }
}
