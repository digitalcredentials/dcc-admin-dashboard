import React from 'react';
import { Props } from 'payload/components/views/Cell';
import { capitalize } from '../../helpers/string.helpers';
import Spinner from '../svgs/Spinner';
import { CREDENTIAL_BATCH_STATUS } from '../../constants/batches';

const CredentialBatchStatusCell: React.FC<Props> = ({ rowData }) => {
    return (
        <section className={`credential-batch-status ${(rowData.status as string).toLowerCase()}`}>
            <span className={(rowData.status as string).toLowerCase()}>
                {rowData.status === CREDENTIAL_BATCH_STATUS.SENDING && (
                    <Spinner className="animate-spin" />
                )}

                {capitalize(rowData.status as string)}
            </span>
        </section>
    );
};

export default CredentialBatchStatusCell;
