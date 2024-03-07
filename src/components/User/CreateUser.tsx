import React, { useCallback } from 'react';
import { Props } from 'payload/components/views/Edit';
import { useAuth } from 'payload/components/utilities';
import { OperationContext } from 'payload/dist/admin/components/utilities/OperationProvider';
import Auth from 'payload/dist/admin/components/views/collections/Edit/Auth';
import RenderUserFlowFields from './RenderUserFlowFields';
import fieldTypes from 'payload/dist/admin/components/forms/field-types';
import Form from '../Form/Form';

const baseClass = 'collection-edit';

const CreateUser: React.FC<Props> = props => {
    const { user, refreshCookieAsync } = useAuth();

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
                        <RenderUserFlowFields
                            readOnly={isReadOnly}
                            permissions={permissions.fields}
                            filter={field =>
                                !field?.admin?.position || field?.admin?.position !== 'sidebar'
                            }
                            fieldTypes={fieldTypes}
                            fieldSchema={fields}
                            className="h-full w-full flex flex-col relative"
                        >
                            <Auth
                                useAPIKey={auth.useAPIKey}
                                requirePassword={!isEditing}
                                verify={auth.verify}
                                collection={collection}
                                email={data?.email}
                                operation={operation}
                                readOnly={!hasSavePermission}
                            />
                        </RenderUserFlowFields>
                    )}
                </section>
            </Form>
        </OperationContext.Provider>
    );
};

export default CreateUser;
