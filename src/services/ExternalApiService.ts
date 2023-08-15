import axios from 'axios';

interface CompanyApiResponse {
    streetAddress: {
        street: { value: string };
        city: { value: string };
        postalCode: { value: string };
    };
    phone: { value: string };
}

export async function fetchCompanyDataFromExternalApi(companyBusinessID: string): Promise<{ streetAddress?: string; phoneNumber?: string }> {
    const externalApiUrl = `https://www.kauppalehti.fi/company-api/basic-info/${companyBusinessID}`;
    console.log('Fetching data from external API:', externalApiUrl);
    const headers = {
        'User-Agent': 'curl/7.68.0'
    };

    try {
        const response = await axios.get<CompanyApiResponse>(externalApiUrl, { headers });
        const externalData = response.data;

        // Type assertion for required properties
        const street = externalData.streetAddress?.street.value;
        const postalCode = externalData.streetAddress?.postalCode.value;
        const city = externalData.streetAddress?.city.value;
        const phoneNumber = externalData.phone.value;

        // Type safeguarding
        if (street && postalCode && city && phoneNumber) {
            const streetAddress = `${street}, ${postalCode}, ${city}`;
            return { streetAddress, phoneNumber };
        } else {
            console.error('Error: Required properties missing in API response.');
            return {};
        }
    } catch (error) {
        console.error('Error fetching data from external API:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        return {};
    }
}
