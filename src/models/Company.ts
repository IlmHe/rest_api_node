import { Contact } from './Contact';

export interface Company {
    name: string;
    contactEmail?: string;
    companyWebsite?: string;
    companyBusinessID?: string;
    streetAddress?: string;
    phoneNumber?: string;
    contacts?: Contact[];
}
