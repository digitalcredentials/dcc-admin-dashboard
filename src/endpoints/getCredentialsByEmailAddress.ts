import { PayloadHandler } from 'payload/config';
import { Forbidden } from 'payload/errors';
import payload from 'payload';

export const getCredentialsByEmailAddress: PayloadHandler = async (req, res, next) => {
   // if (!req.user) return res.sendStatus(401);

    const { email, page = 1 } = req.body;

    try {
        const data = await payload.find({
            collection: 'credential', // required
            depth: 1,
            page,
            limit: 20,
            where: { emailAddress: { equals: email } }, 
          //  sort: '-credentialName',
            locale: 'en',
        });

        res.status(200).json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ version: undefined });
    }
};
