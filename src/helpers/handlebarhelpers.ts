import { GUARANTEED_FIELDS } from './credential.helpers';
import { createJsonHandlebars } from './handlebarsJson';

export const HANDLEBAR_TAG_REGEX = /{{[{[]?(.*?)[\]}]?}}/g;

const placeHolderVcTemplate = `{
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1"
    ],
    "type": ["VerifiableCredential", "AlumniCredential"],
    "issuer": { "id": "{{ schoolId }}" },
    "name": "{{ name }}",
    "description": "{{ description }}",
    "issuanceDate": "{{ now }}",
    "credentialSubject": { "id": "{{ studentId }}" },
    "id": "{{ credentialId }}"
  }`;

const templateValuesDummy = {
    'schoolId': 'Clemson University',
    'name': 'Jimbo Wales',
    'description': 'test description',
    'issuanceDate': '08/18/2023',
    'studentId': '1231231231323',
    'credentialId': '234234234234',
};

export const insertValuesIntoHandlebarsJsonTemplate = (template?: string, fieldValues?: any) => {
    const handlebars = createJsonHandlebars();
    // compile the template
    const _template = template || placeHolderVcTemplate; //dummy template
    const compiledTemplate = handlebars.compile(_template);

    // execute the template
    const data = fieldValues || templateValuesDummy; // dummy data
    const obj = compiledTemplate(data);

    return obj; // return template with inserted values
};

export const getFieldsFromHandlebarsJsonTemplate = (template?: string): string[] => {
    const withDuplicates = Array.from(template.matchAll(HANDLEBAR_TAG_REGEX)).map(match =>
        match[1].trim()
    );
    return [...new Set(withDuplicates)];
};

export const getFieldsIntersectionFromHandlebarsJsonTemplate = (
    csvFields: string[],
    templateFields: string[]
): {
    missingInCSV: string[];
    missingInTemplate: string[];
} => {
    return {
        missingInCSV: templateFields.filter(field => !csvFields.includes(field)),
        missingInTemplate: csvFields.filter(field => !templateFields.includes(field)),
    };
};

export const validateBatchCSV = (batchFields: string[], template: string): boolean => {
    const templateFields = [...getFieldsFromHandlebarsJsonTemplate(template), ...GUARANTEED_FIELDS];

    return templateFields.some(field => !batchFields.includes(field));
};
