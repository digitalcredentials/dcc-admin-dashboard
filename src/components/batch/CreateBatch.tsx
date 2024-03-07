import React, { useCallback } from 'react';
import { useModal } from '@faceless-ui/modal';
import { Props } from 'payload/components/views/Edit';
import { useAuth } from 'payload/components/utilities';
import { OperationContext } from 'payload/dist/admin/components/utilities/OperationProvider';
import RenderBatchFlowFields from './RenderBatchFlowFields';
import fieldTypes from 'payload/dist/admin/components/forms/field-types';
import Form from '../Form/Form';
import './batch.scss';
import '../../global.scss';
import BatchSent from './BatchSent';
import { CREDENTIAL_BATCH_STATUS } from '../../constants/batches';

const baseClass = 'collection-edit';

const CreateBatch: React.FC<Props> = props => {
    const { user, refreshCookieAsync } = useAuth();
    const { openModal } = useModal();

    const {
        data,
        collection,
        isEditing,
        onSave: onSaveFromProps,
        permissions,
        isLoading,
        internalState,
        action,
        hasSavePermission,
        id,
    } = props;

    const isReadOnly = !hasSavePermission || data?.status !== CREDENTIAL_BATCH_STATUS.DRAFT;

    const batchSlug = 'batch-sent';

    const { fields, auth } = collection;

    const operation = isEditing ? 'update' : 'create';

    const onSave = useCallback(
        async json => {
            if (auth && id === user.id) await refreshCookieAsync();

            if (typeof onSaveFromProps === 'function') {
                onSaveFromProps({ ...json, operation: id ? 'update' : 'create' });
            }
        },
        [id, onSaveFromProps, auth, user, refreshCookieAsync]
    );

    const sendOutBatchEmails = async (formData?: { emailTemplate: string }) => {
        const res = await fetch('/api/send-batch-email', {
            method: 'POST',
            body: JSON.stringify({ batchId: id, emailTemplateId: formData?.emailTemplate }),
            headers: { 'Content-type': 'application/json' },
        });

        if (res.status === 200) {
            const { data } = await res.json();
            console.log('///sent batch for processing', data);
        }
    };

    // Submit batch id to endpoint for sending out emails
    const handleOnSubmit = async (fields, formData) => {
        console.log('///handleonSave', 'fields', fields, 'formData', formData);
        // trigger send email
        const data = await sendOutBatchEmails(formData);

        openModal(batchSlug);
        // if success show success modal....
    };

    return (
        <OperationContext.Provider value={operation}>
            <Form
                className={`${baseClass}__form`}
                method={id ? 'patch' : 'post'}
                action={action}
                onSubmit={handleOnSubmit}
                onSuccess={onSave}
                disabled={isReadOnly}
                initialState={internalState}
            >
                <section className="h-full w-full flex">
                    {!isLoading && (
                        <>
                            <RenderBatchFlowFields
                                readOnly={isReadOnly}
                                permissions={permissions.fields}
                                filter={field =>
                                    !field?.admin?.position || field?.admin?.position !== 'sidebar'
                                }
                                fieldTypes={fieldTypes}
                                fieldSchema={fields}
                                className="h-full w-full flex flex-col relative"
                            />
                            <BatchSent slug={batchSlug} />
                        </>
                    )}
                </section>
            </Form>
        </OperationContext.Provider>
    );
};

export default CreateBatch;
