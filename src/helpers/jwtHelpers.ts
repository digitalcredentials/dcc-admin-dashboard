import jwt from 'jsonwebtoken';
const secret =
    process.env.PAYLOAD_SECRET ??
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabaaaaaaaaaaaaaaaaaaaa';
const expires = process.env.TOKEN_EXPIRATION_TIME_IN_SECONDS ?? 14 * 24 * 60 * 60; // Default to 2 weeks

export const generateJwtFromId = (id: string) => {
    try {
        const token = jwt.sign({ id }, secret, { ...(expires && { expiresIn: expires }) });
        return token;
    } catch (e) {
        throw new Error(e);
    }
};
