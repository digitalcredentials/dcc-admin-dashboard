import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useConfig } from 'payload/components/utilities';
import PreviewButton from 'payload/dist/admin/components/elements/PreviewButton';
import CustomRenderFields from '../CustomRenderFields';
import CopyToClipboard from 'payload/dist/admin/components/elements/CopyToClipboard';
import DuplicateDocument from 'payload/dist/admin/components/elements/DuplicateDocument';
import DeleteDocument from 'payload/dist/admin/components/elements/DeleteDocument';
import fieldTypes from 'payload/dist/admin/components/forms/field-types';
import VersionsCount from 'payload/dist/admin/components/elements/VersionsCount';
import Autosave from 'payload/dist/admin/components/elements/Autosave';
import Status from 'payload/dist/admin/components/elements/Status';
import { Publish } from 'payload/dist/admin/components/elements/Publish';
import { SaveDraft } from 'payload/dist/admin/components/elements/SaveDraft';
import { Save } from 'payload/dist/admin/components/elements/Save';
import { useDocumentInfo } from 'payload/dist/admin/components/utilities/DocumentInfo';
import { formatDate } from 'payload/dist/admin/utilities/formatDate';
import { Props } from '../types';

const baseClass = 'collection-edit';

const SidebarMenu: React.FC<Props> = props => {
    const {
        admin: { dateFormat },
        routes: { admin },
    } = useConfig();
    const { publishedDoc } = useDocumentInfo();
    const { t, i18n } = useTranslation('general');

    const {
        collection,
        isEditing,
        data,
        permissions,
        apiURL,
        hasSavePermission,
        disableActions,
        id,
        updatedAt,
    } = props;

    const {
        slug,
        fields,
        admin: { disableDuplicate, preview, hideAPIURL },
        versions,
        timestamps,
        auth,
    } = collection;

    return (
        <div className={`${baseClass}__sidebar-wrap`}>
            <div className={`${baseClass}__sidebar`}>
                <div className={`${baseClass}__sidebar-sticky-wrap`}>
                    {!disableActions && (
                        <ul className={`${baseClass}__collection-actions`}>
                            {permissions?.create?.permission && (
                                <React.Fragment>
                                    <li>
                                        <Link
                                            id="action-create"
                                            to={`${admin}/collections/${slug}/create`}
                                        >
                                            {t('Create New')}
                                        </Link>
                                    </li>

                                    {!disableDuplicate && isEditing && (
                                        <li>
                                            <DuplicateDocument
                                                collection={collection}
                                                id={id}
                                                slug={slug}
                                            />
                                        </li>
                                    )}
                                </React.Fragment>
                            )}

                            {permissions?.delete?.permission && (
                                <li>
                                    <DeleteDocument
                                        collection={collection}
                                        id={id}
                                        buttonId="action-delete"
                                    />
                                </li>
                            )}
                        </ul>
                    )}

                    <div
                        className={[
                            `${baseClass}__document-actions`,
                            ((collection.versions?.drafts &&
                                !collection.versions?.drafts?.autosave) ||
                                (isEditing && preview)) &&
                            `${baseClass}__document-actions--has-2`,
                        ]
                            .filter(Boolean)
                            .join(' ')}
                    >
                        {isEditing &&
                            preview &&
                            (!collection.versions?.drafts ||
                                collection.versions?.drafts?.autosave) && (
                                <PreviewButton
                                    generatePreviewURL={preview}
                                    CustomComponent={
                                        collection?.admin?.components?.edit?.PreviewButton
                                    }
                                />
                            )}

                        {hasSavePermission && (
                            <React.Fragment>
                                {collection.versions?.drafts ? (
                                    <React.Fragment>
                                        {!collection.versions.drafts.autosave && (
                                            <SaveDraft
                                                CustomComponent={
                                                    collection?.admin?.components?.edit
                                                        ?.SaveDraftButton
                                                }
                                            />
                                        )}

                                        <Publish
                                            CustomComponent={
                                                collection?.admin?.components?.edit?.PublishButton
                                            }
                                        />
                                    </React.Fragment>
                                ) : (
                                    <Save
                                        CustomComponent={
                                            collection?.admin?.components?.edit?.SaveButton
                                        }
                                    />
                                )}
                            </React.Fragment>
                        )}
                    </div>

                    <div className={`${baseClass}__sidebar-fields`}>
                        {isEditing &&
                            preview &&
                            collection.versions?.drafts &&
                            !collection.versions?.drafts?.autosave && (
                                <PreviewButton
                                    generatePreviewURL={preview}
                                    CustomComponent={
                                        collection?.admin?.components?.edit?.PreviewButton
                                    }
                                />
                            )}

                        {collection.versions?.drafts && (
                            <React.Fragment>
                                <Status />
                                {collection.versions?.drafts.autosave && hasSavePermission && (
                                    <Autosave
                                        publishedDocUpdatedAt={
                                            publishedDoc?.updatedAt || data?.createdAt
                                        }
                                        collection={collection}
                                        id={id}
                                    />
                                )}
                            </React.Fragment>
                        )}

                        <CustomRenderFields
                            readOnly={!hasSavePermission}
                            permissions={permissions.fields}
                            filter={field => field?.admin?.position === 'sidebar'}
                            fieldTypes={fieldTypes}
                            fieldSchema={fields}
                        />
                    </div>

                    {isEditing && (
                        <ul className={`${baseClass}__meta`}>
                            {!hideAPIURL && (
                                <li className={`${baseClass}__api-url`}>
                                    <span className={`${baseClass}__label`}>
                                        API URL <CopyToClipboard value={apiURL} />
                                    </span>
                                    <a href={apiURL} target="_blank" rel="noopener noreferrer">
                                        {apiURL}
                                    </a>
                                </li>
                            )}

                            {versions && (
                                <li>
                                    <div className={`${baseClass}__label`}>
                                        {t('version:versions')}
                                    </div>
                                    <VersionsCount collection={collection} id={id} />
                                </li>
                            )}

                            {timestamps && (
                                <React.Fragment>
                                    {updatedAt && (
                                        <li>
                                            <div className={`${baseClass}__label`}>
                                                {t('lastModified')}
                                            </div>
                                            <div>
                                                {formatDate(
                                                    data.updatedAt,
                                                    dateFormat,
                                                    i18n?.language
                                                )}
                                            </div>
                                        </li>
                                    )}
                                    {(publishedDoc?.createdAt || data?.createdAt) && (
                                        <li>
                                            <div className={`${baseClass}__label`}>
                                                {t('created')}
                                            </div>
                                            <div>
                                                {formatDate(
                                                    publishedDoc?.createdAt || data?.createdAt,
                                                    dateFormat,
                                                    i18n?.language
                                                )}
                                            </div>
                                        </li>
                                    )}
                                </React.Fragment>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SidebarMenu;
