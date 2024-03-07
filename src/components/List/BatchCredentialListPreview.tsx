import React from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowInfo } from '@faceless-ui/window-info';
import { RelationshipProvider } from 'payload/dist/admin/components/views/collections/List/RelationshipProvider';
import { getTranslation } from 'payload/dist/utilities/getTranslation';
import { StaggeredShimmers } from 'payload/dist/admin/components/elements/ShimmerEffect';
import SortColumn from 'payload/dist/admin/components/elements/SortColumn';
import Paginator from 'payload/dist/admin/components/elements/Paginator';
import { SelectionProvider } from 'payload/dist/admin/components/views/collections/List/SelectionProvider';
import formatFilesize from '../../helpers/formatFileSize';
import Table from '../Table/Table';
import './index.scss';
import { TableColumnsProvider } from 'payload/dist/admin/components/elements/TableColumns';
import { useConfig } from 'payload/components/utilities';
import { Credential } from 'payload/generated-types';
import { Column } from 'payload/dist/admin/components/elements/Table/types';
import { Cell } from 'payload/components/views/Cell';
import ActionsButton from '../ActionsButton';
import { PaginatedDocs } from 'payload/dist/mongoose/types';

const baseClass = 'collection-list';

const FIELDS_TO_DISPLAY = ['earnerName', 'credentialName', 'emailAddress', 'actionButton'];

type BatchCredentialListPreviewProps = {
    data: PaginatedDocs<Credential>;
    refetch: (page: number) => Promise<void>;
    readOnly?: boolean;
};

const BatchCredentialListPreview: React.FC<BatchCredentialListPreviewProps> = ({
    data,
    refetch,
    readOnly = false,
}) => {
    const { collections } = useConfig();
    const collection = collections.find(collection => collection.slug === 'credential');

    if (!data) return <></>;

    const {
        breakpoints: { s: smallBreak },
    } = useWindowInfo();
    const { t, i18n } = useTranslation('general');
    let formattedDocs = data.docs || [];

    console.log('//formattedDocs', formattedDocs);

    if (collection.upload) {
        formattedDocs = formattedDocs?.map(doc => {
            return { ...doc, filesize: formatFilesize(doc.filesize) };
        });
    }

    const columns: Column[] = collection.fields
        .filter(field => FIELDS_TO_DISPLAY.includes((field as any).name ?? ''))
        .map((field, index) => ({
            accessor: (field as any).name,
            active: true,
            label: (field as any).label,
            name: (field as any).name,
            components: {
                Heading: (
                    <SortColumn
                        label={(field as any).label || (field as any).name}
                        name={(field as any).name}
                        disable={
                            ('disableSort' in field && Boolean(field.disableSort)) ||
                            field.type === 'ui' ||
                            undefined
                        }
                    />
                ),
                renderCell: (rowData, cellData) => (
                    <Cell
                        key={JSON.stringify(cellData)}
                        field={
                            (field as any).name === 'actionButton'
                                ? {
                                    ...field,
                                    admin: {
                                        ...field.admin,
                                        components: {
                                            ...field.admin?.components,
                                            Cell: props => (
                                                <ActionsButton
                                                    simple
                                                    readOnly={readOnly}
                                                    onDelete={refetch}
                                                    {...props}
                                                />
                                            ),
                                        },
                                    },
                                }
                                : field
                        }
                        colIndex={index}
                        collection={collection}
                        rowData={rowData}
                        cellData={cellData}
                        link={false}
                    />
                ),
            },
        }));

    return (
        <TableColumnsProvider collection={collection}>
            <div className={`${baseClass} scale-100`}>
                <SelectionProvider docs={data.docs} totalDocs={data.totalDocs}>
                    {!data.docs && (
                        <StaggeredShimmers
                            className={[
                                `${baseClass}__shimmer`,
                                `${baseClass}__shimmer--rows`,
                            ].join(' ')}
                            count={6}
                        />
                    )}
                    {data.docs && data.docs.length > 0 && (
                        <>
                            <RelationshipProvider>
                                <Table data={formattedDocs} columns={columns} />
                            </RelationshipProvider>

                            <div className={`${baseClass}__page-controls`}>
                                <Paginator
                                    limit={data.limit}
                                    totalPages={data.totalPages}
                                    page={data.page}
                                    hasPrevPage={data.hasPrevPage}
                                    hasNextPage={data.hasNextPage}
                                    prevPage={data.prevPage}
                                    nextPage={data.nextPage}
                                    numberOfNeighbors={1}
                                    onChange={refetch}
                                />
                                {data?.totalDocs > 0 && (
                                    <>
                                        <div className={`${baseClass}__page-info`}>
                                            {data.page * data.limit - (data.limit - 1)}-
                                            {data.totalPages > 1 && data.totalPages !== data.page
                                                ? data.limit * data.page
                                                : data.totalDocs}{' '}
                                            {t('of')} {data.totalDocs}
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                    {data.docs && data.docs.length === 0 && (
                        <div className={`${baseClass}__no-results`}>
                            <p>{t('noResults', { label: getTranslation('Credentials', i18n) })}</p>
                        </div>
                    )}
                </SelectionProvider>
            </div>
        </TableColumnsProvider>
    );
};

export default BatchCredentialListPreview;
