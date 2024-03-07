import { PayloadHandler } from 'payload/config';
import { Forbidden } from 'payload/errors';
import payload from 'payload';
import { CREDENTIAL_STATUS } from '../constants/credentials';

export const createBatchCredentials: PayloadHandler = async (req, res) => {
    if (!req.user) throw new Forbidden();

    try {
        console.log('//req body', req?.body);
        const id = req?.body?.batchId;
        const newFields: string[] = req?.body?.fields ?? [];

        const created = await Promise.all(
            req?.body?.credentialRecords?.map(async record => {
                const newCredentialRecord = await payload.create({
                    collection: 'credential',
                    data: {
                        credentialName: record?.credentialName,
                        earnerName: record?.earnerName,
                        emailAddress: record?.emailAddress,
                        extraFields: record,
                        status: CREDENTIAL_STATUS.DRAFT,
                        batch: id,
                    },
                    locale: 'en',
                });

                return newCredentialRecord;
            })
        );

        console.log('///CREATE CRED BATCH ENDPOINT', created);

        const newBatch = await payload.update({
            collection: 'credential-batch',
            draft: true,
            id,
            data: { csvFields: newFields },
        });

        // Queue up email jobs for the batch

        res.status(200).json({ data: created, newBatch });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
};
