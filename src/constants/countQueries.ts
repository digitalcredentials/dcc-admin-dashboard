import { CREDENTIAL_BATCH_STATUS } from './batches';

// payload localAPI query object for getting credential batches that are of sent status
export const totalSentBatchesQuery = { status: CREDENTIAL_BATCH_STATUS.SENT };

//payload localAPI query object for getting all credential templates that are published status
export const totalCredentialTemplatePublishedQuery = { title: { $exists: true } };

export const totalEmailTemplatePublishedQuery = { title: { $exists: true } };
