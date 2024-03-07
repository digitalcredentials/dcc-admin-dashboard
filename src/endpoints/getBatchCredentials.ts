import { PayloadHandler } from 'payload/config';
import { Forbidden } from 'payload/errors';
import payload from 'payload';

export const getBatchCredentials: PayloadHandler = async (req, res, next) => {
    if (!req.user) return res.sendStatus(401);

    const { batchId, page = 1 } = req.body;

    try {
        const data = await payload.find({
            collection: 'credential', // required
            depth: 1,
            page,
            limit: 10,
            where: { batch: { equals: batchId } }, // pass a `where` query here
            sort: '-title',
            locale: 'en',
        });

        res.status(200).json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ version: undefined });
    }
};
