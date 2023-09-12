import { buildConfig } from 'payload/config';
import path from 'path';
// import Examples from './collections/Examples';
import Users from './collections/Users';
import CredentialsTemplatesCollection from './collections/CredentialTemplates';
import CredentialsBatchesCollection from './collections/CredentialBatches';
import CredentialsCollection from './collections/Credentials';
import EmailTemplatesCollection from './collections/EmailTemplates';
import AfterNavLinks from './components/AfterNavLinks';
//components
import { Logo } from './components/Logo';
import { Icon } from './components/Icon';

//endpoints
import { readPayloadVersion } from './endpoints/readPayloadVersion';
import { createBatchCredentials } from './endpoints/createCredentialsForBatch';
import { getBatchCredentials } from './endpoints/getBatchCredentials';
import { getCredential, getCredentialJwt } from './endpoints/getCredential';
export default buildConfig({
    serverURL: 'http://localhost:3000',
    admin: {
        user: Users.slug,
        meta: {
            titleSuffix: '- Tecnológico de Monterrey',
            favicon: '/assets/tdm-logo.png',
            ogImage: '/assets/tdm-og.png',
        },
        components: {
            graphics: {
                Logo,
                Icon,
            },
        },
    },
    cors: '*',
    collections: [
        Users,
        CredentialsTemplatesCollection,
        CredentialsBatchesCollection,
        CredentialsCollection,
        EmailTemplatesCollection,
        // Add Collections here
        // Examples,
    ],
    endpoints: [
        {
            method: 'get',
            path: '/payload-version',
            handler: readPayloadVersion,
        },
        {
            method: 'post',
            path: '/get-batch-credentials',
            handler: getBatchCredentials,
        },
        {
            method: 'post',
            path: '/create-batch-credentials',
            handler: createBatchCredentials,
        },
        // TODO: This is a security hole that needs to go away when we're done testing!!!
        {
            method: 'get',
            path: '/get-credential-jwt',
            handler: getCredentialJwt,
        },
        {
            method: 'get',
            path: '/get-credential',
            handler: getCredential,
        },
    ],
    typescript: {
        outputFile: path.resolve(__dirname, 'payload-types.ts'),
    },
    graphQL: {
        schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
    },
});