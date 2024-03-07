import React, { useCallback } from 'react';
import { Props } from 'payload/components/views/Edit';
import { useAuth } from 'payload/components/utilities';
import { OperationContext } from 'payload/dist/admin/components/utilities/OperationProvider';
import RenderTemplateFlowFields from './RenderTemplateFlowFields';
import fieldTypes from 'payload/dist/admin/components/forms/field-types';
import Form from '../Form/Form';
import './template.scss';
import '../../global.scss';

const baseClass = 'collection-edit';

const CreateTemplate: React.FC<Props> = props => {
    const { user, refreshCookieAsync } = useAuth();

    const {
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

    const isReadOnly = !hasSavePermission;

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

    return (
        <OperationContext.Provider value={operation}>
            <Form
                className={`${baseClass}__form`}
                method={id ? 'patch' : 'post'}
                action={action}
                onSuccess={onSave}
                disabled={isReadOnly}
                initialState={internalState}
            >
                <section className="h-full w-full flex">
                    {!isLoading && (
                        <>
                            <RenderTemplateFlowFields
                                readOnly={isReadOnly}
                                permissions={permissions.fields}
                                filter={field =>
                                    !field?.admin?.position || field?.admin?.position !== 'sidebar'
                                }
                                fieldTypes={fieldTypes}
                                fieldSchema={fields}
                                className="h-full w-full flex flex-col relative"
                            />
                        </>
                    )}
                </section>
            </Form>
        </OperationContext.Provider>
    );
};

export default CreateTemplate;
