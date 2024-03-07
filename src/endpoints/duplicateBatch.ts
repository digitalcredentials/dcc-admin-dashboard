import { PayloadHandler } from 'payload/config';
import payload from 'payload';
import { CREDENTIAL_BATCH_STATUS } from '../constants/batches';

export const duplicateBatch: PayloadHandler = async (req, res) => {
    if (!req.user) return res.sendStatus(401);

    const { id } = req.params;

    try {
        const batch = await payload.findByID({ collection: 'credential-batch', id, depth: 0 });
        const {
            id: _id,
            status: _status,
            updatedAt: _updatedAt,
            createdAt: _createdAt,
            ...fieldsToDuplicate
        } = batch;

        const newId = await payload.create({
            collection: 'credential-batch',
            draft: true,
            data: { ...fieldsToDuplicate, status: CREDENTIAL_BATCH_STATUS.DRAFT },
        });

        return res.status(200).json(newId);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};
