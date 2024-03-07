import { CollectionConfig } from 'payload/types';
import BatchPageDescription from '../components/batch/BatchPageDescription';
import CreateBatch from '../components/batch/CreateBatch';
import payload from 'payload';
import { CREDENTIAL_BATCH_STATUS } from '../constants/batches';
import CredentialBatchStatusCell from '../components/batch/CredentialBatchStatusCell';
import { duplicateBatch } from '../endpoints/duplicateBatch';

const CredentialsBatchesCollection: CollectionConfig = {
    slug: 'credential-batch',
    labels: { plural: 'Issuance Overview' },
    access: {
        delete: async ({ id }) => {
            try {
                if (!id) return true;

                const doc = await payload.findByID({ collection: 'credential-batch', id });

                if (!doc) return false;

                return doc.status === CREDENTIAL_BATCH_STATUS.DRAFT;
            } catch (error) {
                console.error('Error getting delete permission for credential batch!', {
                    error,
                    id,
                });

                return false;
            }
        },
        update: async ({ id }) => {
            try {
                if (!id) return false;

                const doc = await payload.findByID({ collection: 'credential-batch', id });

                if (!doc) return false;

                return doc.status === CREDENTIAL_BATCH_STATUS.DRAFT;
            } catch (error) {
                console.error('Error getting delete permission for credential batch!', {
                    error,
                    id,
                });

                return false;
            }
        },
    },
    admin: {
        defaultColumns: ['title', 'id', 'status'],
        useAsTitle: 'title',
        description: BatchPageDescription,
        components: {
            views: {
                Edit: CreateBatch,
            },
        },
    },
    versions: {
        drafts: {
            autosave: true,
        },
    },
    endpoints: [{ path: '/:id/duplicate', method: 'post', handler: duplicateBatch }],
    fields: [
        {
            name: 'title',
            label: 'Batch Title',
            type: 'text',
            required: true,
            minLength: 3,
            maxLength: 100,
        },
        {
            name: 'description',
            type: 'textarea',
            required: false,
            maxLength: 1000,
        },
        {
            name: 'internalNotes',
            type: 'textarea',
            required: false,
            maxLength: 1000,
        },
        {
            name: 'status',
            type: 'text',
            required: true,
            defaultValue: CREDENTIAL_BATCH_STATUS.DRAFT,
            admin: { hidden: true, components: { Cell: CredentialBatchStatusCell } },
        },
        {
            name: 'template',
            type: 'relationship',
            required: true,
            relationTo: 'credential-template',
            hasMany: false,
        },
        {
            name: 'emailTemplate',
            type: 'relationship',
            required: true,
            relationTo: 'email-template',
            hasMany: false,
        },
        {
            name: 'from',
            label: 'Email From',
            type: 'text',
            required: false,
            admin: { description: 'Example: Bob <bob@gmail.com>' },
        },
        {
            name: 'csvFields',
            type: 'json',
            admin: { hidden: true },
        },
    ],
};

export default CredentialsBatchesCollection;
