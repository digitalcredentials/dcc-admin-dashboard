import { PayloadHandler } from 'payload/config';
import payload from 'payload';
import { credentialHasCsvField, getCsvFieldsFromCredential } from '../helpers/credential.helpers';

export const getBatchFields: PayloadHandler = async (req, res) => {
    if (!req.user) return res.sendStatus(401);

    const { id } = req.body;

    try {
        let page = await payload.find({
            collection: 'credential',
            depth: 0,
            where: { batch: { equals: id } },
            limit: 25,
            page: 1,
        });

        let fields = page.docs[0] ? getCsvFieldsFromCredential(page.docs[0]) : [];

        fields = fields.filter(field => {
            return page.docs.slice(1).every(credential => credentialHasCsvField(field, credential));
        });

        while (page.hasNextPage) {
            page = await payload.find({
                collection: 'credential',
                depth: 0,
                where: { batch: { equals: id } },
                limit: 25,
                page: page.nextPage,
            });

            // eslint-disable-next-line @typescript-eslint/no-loop-func
            fields = fields.filter(field => {
                return page.docs.every(credential => credentialHasCsvField(field, credential));
            });
        }

        await payload.update({
            collection: 'credential-batch',
            id,
            data: { csvFields: fields },
        });

        return res.status(200).json(fields);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};
