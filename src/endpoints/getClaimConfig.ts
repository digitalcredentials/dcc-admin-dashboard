import { PayloadHandler } from 'payload/config';

const logoURL = process.env.CLAIM_PAGE_LOGO_URL ?? 'default'
const logoWidth = process.env.CLAIM_PAGE_LOGO_WIDTH ?? 433
const logoHeight = process.env.CLAIM_PAGE_LOGO_HEIGHT ?? 291

export const getClaimConfig: PayloadHandler = (req, res) => {
    try {
        res.status(200).json({ logoURL, logoHeight, logoWidth });
    } catch (err) {
        console.error(err);
        res.status(500).json({ logoURL, logoHeight, logoWidth });
    }
};
