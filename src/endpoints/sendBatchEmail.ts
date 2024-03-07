import { PayloadHandler } from 'payload/config';
import { Forbidden } from 'payload/errors';
import payload from 'payload';
import { sendEmails } from '../jobs/queue.server';
import { generateJwtFromId } from '../helpers/jwtHelpers';
import Handlebars from 'handlebars';
import { CREDENTIAL_BATCH_STATUS } from '../constants/batches';
import { CredentialBatch } from 'payload/generated-types';

export const sendBatchEmail: PayloadHandler = async (req, res, next) => {
    if (!req.user) throw new Forbidden();
    console.log('////req?.body', req.body);
    //get batch id
    const batchId = req?.body?.batchId;
    const emailTemplateId = req?.body?.emailTemplateId;

    console.log('//emailTemplateId', emailTemplateId);

    if (!batchId || !emailTemplateId) return res.sendStatus(400);
    //get email template for batch
    const emailTemplateRecord = await payload.findByID({
        collection: 'email-template',
        id: emailTemplateId,
        depth: 2,
        showHiddenFields: true,
        locale: 'en',
    });

    console.log('///emailTemplateRecord', emailTemplateRecord);

    // email template code
    const emailTemplate = emailTemplateRecord?.emailTemplatesHandlebarsCode;
    if (!emailTemplate) return res.sendStatus(500);

    console.log('///emailTemplate', emailTemplate);

    // get all credentials records associated with batchId
    const query = {
        batch: {
            equals: batchId,
        },
    };

    console.log('//req body', req?.body);
    const data = await payload.find({
        collection: 'credential', // required
        depth: 2,
        where: { ...query }, // pass a `where` query here
        sort: '-title',
        locale: 'en',
    });

    const handlebarsTemplate = Handlebars.compile(emailTemplate);

    //for each record, generate email link and queue up email to be sent

    const claimPageBaseUrl = process.env.CLAIM_PAGE_URL || 'https://localhost:4321';

    const emails = data?.docs?.map(record => {
        const jwt = generateJwtFromId(record?.id);
        const link = `${claimPageBaseUrl}/?token=${jwt}`;
        // replace handlebar variables in email template with record data
        const mergedRecordWithLink = {
            ...(record.extraFields as any),
            link,
            credentialName: record.credentialName,
            earnerName: record.earnerName,
            emailAddress: record.emailAddress,
            now: new Date().toISOString(),
            issuanceDate: new Date().toISOString(),
        };
        const parsedHtml = handlebarsTemplate(mergedRecordWithLink);
        return {
            credentialId: record.id,
            to: record?.emailAddress,
            from: (record.batch as CredentialBatch).from || emailTemplateRecord.from,
            subject: emailTemplateRecord?.emailSubjectTitle || 'Claim Credential',
            email: 'test email2',
            html: `${parsedHtml}`,
        };
    });

    await payload.update({
        collection: 'credential-batch',
        id: batchId,
        data: { status: CREDENTIAL_BATCH_STATUS.SENDING },
    });

    console.log('///email map', emails);

    // get email template for batch and insert data into template

    try {
        // send emails to email queue
        sendEmails(batchId, emails);

        res.status(200).json({ emails });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};
