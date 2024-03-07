import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { OperationContext } from 'payload/dist/admin/components/utilities/OperationProvider';
import { LoadingOverlayToggle } from 'payload/dist/admin/components/elements/Loading';
import { Props } from 'payload/dist/admin/components/views/Account/types';
import Form from 'payload/dist/admin/components/forms/Form';
import Meta from 'payload/dist/admin/components/utilities/Meta';
import Auth from 'payload/dist/admin/components/views/collections/Edit/Auth';
import RenderTitle from 'payload/dist/admin/components/elements/RenderTitle';
import ReactSelect from 'payload/dist/admin/components/elements/ReactSelect';
import RenderFields from 'payload/dist/admin/components/forms/RenderFields';
import Label from 'payload/dist/admin/components/forms/Label';
import LeaveWithoutSaving from 'payload/dist/admin/components/modals/LeaveWithoutSaving';
import { Save } from 'payload/dist/admin/components/elements/Save';
import { ToggleTheme } from 'payload/dist/admin/components/views/Account/ToggleTheme';
import { Gutter } from 'payload/dist/admin/components/elements/Gutter';
import { useAuth } from 'payload/components/utilities';
import fieldTypes from 'payload/dist/admin/components/forms/field-types';
import getI18n from 'payload/dist/translations/init';

import type { Translation } from 'payload/dist/translations/type';

const baseClass = 'account';

const AccountSettings: React.FC<Props> = ({
    collection,
    data,
    permissions,
    hasSavePermission,
    initialState,
    isLoading,
    action,
    onSave: onSaveFromProps,
}) => {
    const {
        fields,
        admin: { useAsTitle },
        auth,
    } = collection;

    const { refreshCookieAsync } = useAuth();
    const i18n = getI18n({}) as any;
    const { t } = useTranslation('authentication', { i18n });

    const languageOptions = Object.entries(i18n?.options?.resources ?? {}).map(
        ([language, resource]) => ({
            label: (resource as Translation).general.thisLanguage,
            value: language,
        })
    );

    const onSave = useCallback(async () => {
        await refreshCookieAsync();
        if (typeof onSaveFromProps === 'function') {
            onSaveFromProps();
        }
    }, [onSaveFromProps, refreshCookieAsync]);

    const classes = [baseClass].filter(Boolean).join(' ');

    return (
        <React.Fragment>
            <LoadingOverlayToggle name="account" show={isLoading} type="withoutNav" />
            <div className={classes}>
                {!isLoading && (
                    <OperationContext.Provider value="update">
                        <Form
                            className={`${baseClass}__form`}
                            method="patch"
                            action={action}
                            onSuccess={onSave}
                            initialState={initialState}
                            disabled={!hasSavePermission}
                        >
                            <div className={`${baseClass}__main`}>
                                <Meta
                                    title={t('account')}
                                    description={t('accountOfCurrentUser')}
                                    keywords={t('account')}
                                />
                                {!(
                                    collection.versions?.drafts &&
                                    collection.versions?.drafts?.autosave
                                ) && <LeaveWithoutSaving />}
                                <div className={`${baseClass}__edit`}>
                                    <Gutter className={`${baseClass}__header`}>
                                        <h1>
                                            <RenderTitle
                                                data={data}
                                                collection={collection}
                                                useAsTitle={useAsTitle}
                                                fallback={`[${t('general:untitled')}]`}
                                            />
                                        </h1>
                                        <Auth
                                            useAPIKey={auth.useAPIKey}
                                            collection={collection}
                                            email={data?.email}
                                            operation="update"
                                            readOnly={!hasSavePermission}
                                        />
                                        <RenderFields
                                            permissions={permissions.fields}
                                            readOnly={!hasSavePermission}
                                            filter={field => field?.admin?.position !== 'sidebar'}
                                            fieldTypes={fieldTypes}
                                            fieldSchema={fields}
                                        />
                                    </Gutter>
                                    <Gutter className={`${baseClass}__payload-settings`}>
                                        <h3>Settings</h3>

                                        <div className={`${baseClass}__language`}>
                                            <Label label={t('general:language')} />
                                            <ReactSelect
                                                value={languageOptions.find(
                                                    language => language.value === i18n.language
                                                )}
                                                options={languageOptions}
                                                onChange={({ value }) => i18n.changeLanguage(value)}
                                            />
                                        </div>

                                        <ToggleTheme />

                                        {hasSavePermission && (
                                            <Save
                                                CustomComponent={
                                                    collection?.admin?.components?.edit?.SaveButton
                                                }
                                            />
                                        )}
                                    </Gutter>
                                </div>
                            </div>
                        </Form>
                    </OperationContext.Provider>
                )}
            </div>
        </React.Fragment>
    );
};

export default AccountSettings;
