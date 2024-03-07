import React, { useEffect, useState } from 'react';
import { PaginatedDocs } from 'payload/dist/mongoose/types';
import { Credential } from 'payload/generated-types';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RenderCustomComponent from 'payload/dist/admin/components/utilities/RenderCustomComponent';
import useIntersect from 'payload/dist/admin/hooks/useIntersect';
import { RenderFieldProps as Props } from '../types';
import {
    Field,
    fieldAffectsData,
    fieldIsPresentationalOnly,
} from 'payload/dist/fields/config/types';
import { useOperation } from 'payload/dist/admin/components/utilities/OperationProvider/index';
import { getTranslation } from 'payload/dist/utilities/getTranslation';
import { useAllFormFields, useForm } from 'payload/components/forms';
import { Fields } from 'payload/dist/admin/components/forms/Form/types';
import BatchPreviewSubmit from './BatchPreviewSubmit';

import UploadCSV from './UploadCSV';
import useHorizontalPages from '../../hooks/useHorizontalPages';
import {
    getNavFunctions,
    getSimplePages,
    getUnnamedRefsFromArray,
} from '../../helpers/horizontalNav.helpers';
import HorizontalNavHeader from '../navigation/HorizontalNavHeader';
import HorizontalNavFooter from '../navigation/HorizontalNavFooter';
import { useConfig, useDocumentInfo } from 'payload/components/utilities';
import { dedupe } from '../../helpers/array.helpers';
import { GENERATED_FIELDS } from '../../helpers/credential.helpers';
import SelectEmailTemplate from './SelectEmailTemplate';

import './batch.scss';

const baseClass = 'render-fields';

const intersectionObserverOptions = { rootMargin: '1000px' };

// hardcoded for now, but could be perhaps be defined in the database
const MAP_FIELDS_TO_STEPS = {
    1: ['title', 'description', 'internalNotes'],
    2: ['template'],
    3: [],
    4: ['from', 'emailTemplate'],
    5: [],
};

const getFieldsForStep = (step = 1, fieldSchema = []) => {
    const fieldsForStep = MAP_FIELDS_TO_STEPS[step] ?? [];
    const stepFields = fieldSchema.filter(field => fieldsForStep.includes(field.name)) ?? [];

    return stepFields;
};

const getFieldValuesWithValidators = (
    step: number,
    fieldValues: Fields,
    fieldsCollection: Field[]
) => {
    const fieldsForStep: string[] = MAP_FIELDS_TO_STEPS[step];

    return (
        fieldsForStep?.map(fieldName => ({
            value: fieldValues[fieldName].value,
            validate: fieldsCollection.find(field => (field as any).name === fieldName).validate,
        })) ?? []
    );
};

const isStepValid = async (
    valuesWithValidators: { value: any; validate: (value: any) => Promise<boolean> }[]
) => {
    try {
        const results = await Promise.all(
            valuesWithValidators.map(async ({ value, validate }) => {
                return (await validate?.(value)) ?? true;
            })
        );

        return results.every(Boolean);
    } catch (error) {
        // validate function is expecting t to be passed in in order to get an error message, which
        // will throw an error because we're not passing it in and ignoring the error message
        return false;
    }
};

type RenderSlideProps = {
    step: number;
    formProps: Props;
};

const RenderSlide = React.forwardRef<HTMLElement, RenderSlideProps>(function RenderSlide(
    { step, formProps },
    ref
) {
    const { t, i18n } = useTranslation('general');
    const operation = useOperation();

    const {
        fieldSchema,
        fieldTypes,
        filter,
        permissions,
        readOnly: readOnlyOverride,
        indexPath: incomingIndexPath,
    } = formProps;

    const stepFormFields = getFieldsForStep(step, fieldSchema);

    const renderFields = stepFormFields?.map((field, fieldIndex) => {
        const fieldIsPresentational = fieldIsPresentationalOnly(field);
        let FieldComponent = fieldTypes[field.type];

        if (fieldIsPresentational || (!field?.hidden && field?.admin?.disabled !== true)) {
            if ((filter && typeof filter === 'function' && filter(field)) || !filter) {
                if (fieldIsPresentational) {
                    return <FieldComponent {...field} key={fieldIndex} />;
                }

                if (field?.admin?.hidden) {
                    FieldComponent = fieldTypes.hidden;
                }

                const isFieldAffectingData = fieldAffectsData(field);

                const fieldPermissions = isFieldAffectingData
                    ? permissions?.[field.name]
                    : permissions;

                let { admin: { readOnly } = {} } = field;

                if (readOnlyOverride && readOnly !== false) readOnly = true;

                if (
                    (isFieldAffectingData &&
                        permissions?.[field?.name]?.read?.permission !== false) ||
                    !isFieldAffectingData
                ) {
                    if (
                        isFieldAffectingData &&
                        permissions?.[field?.name]?.[operation]?.permission === false
                    ) {
                        readOnly = true;
                    }

                    if (FieldComponent) {
                        return (
                            <RenderCustomComponent
                                key={fieldIndex}
                                CustomComponent={field?.admin?.components?.Field}
                                DefaultComponent={FieldComponent}
                                componentProps={{
                                    ...field,
                                    path: field.path || (isFieldAffectingData ? field.name : ''),
                                    fieldTypes,
                                    indexPath: incomingIndexPath
                                        ? `${incomingIndexPath}.${fieldIndex}`
                                        : `${fieldIndex}`,
                                    admin: {
                                        ...(field.admin || {}),
                                        readOnly,
                                    },
                                    permissions: fieldPermissions,
                                }}
                            />
                        );
                    }

                    return (
                        <div className="missing-field" key={fieldIndex}>
                            {t('error:noMatchedField', {
                                label: fieldAffectsData(field)
                                    ? getTranslation(field.label || field.name, i18n)
                                    : field.path,
                            })}
                        </div>
                    );
                }
            }

            return null;
        }
    });

    const getTitle = () => {
        if (step === 1) {
            return (
                <>
                    <h2 className="mt-5 text-[--theme-text] text-3xl font-semibold mb-5 font-inter">
                        Add Batch Details
                    </h2>
                    <p className="text-[--theme-text] text-xl font-medium font-inter mb-15">
                        Provide information about the credentials you’re uploading to this batch to
                        streamline the issuance process.
                    </p>
                </>
            );
        }

        if (step === 2) {
            return (
                <>
                    <h2 className="mt-5 text-[--theme-text] text-3xl font-semibold mb-5 font-inter">
                        Select Credential Template
                    </h2>
                    <p className="text-[--theme-text] text-xl font-medium font-inter mb-15">
                        Select from the published templates in the list.
                    </p>
                </>
            );
        }

        if (step === 4) {
            return (
                <>
                    <h2 className="mt-5 text-[--theme-text] text-3xl font-semibold mb-5 font-inter">
                        Select Email Template
                    </h2>
                    <p className="text-[--theme-text] text-xl font-medium font-inter mb-15">
                        Select an email template to be sent to the earners.
                    </p>
                </>
            );
        }
    };

    return (
        <section
            ref={ref}
            className="batch-flow-slide snap-start w-full h-full flex-shrink-0 px-20 pb-10 pt-15 overflow-y-auto"
        >
            {getTitle()}
            {renderFields}
        </section>
    );
});

const FormSteps = (props: Props) => {
    const location = useLocation();
    const history = useHistory();

    const { submit } = useForm();

    const {
        routes: { admin: adminRoute },
    } = useConfig();
    const { id, collection } = useDocumentInfo();

    const refs = getUnnamedRefsFromArray([1, 2, 3, 4, 5]);
    const { on, scrollTo } = useHorizontalPages({ refs });
    const {
        goBack,
        goForward,
        currentPage,
        headerPages: pages,
    } = getNavFunctions({ on, scrollTo, pages: getSimplePages(refs) });
    // the `fields` const will be equal to all fields' state,
    // and the `dispatchFields` method is usable to send field state up to the form
    const [fields, _dispatchFields] = useAllFormFields();

    const [csvFields, setCsvFields] = useState<string[]>(
        dedupe([...((fields.csvFields?.value as any) ?? []), ...GENERATED_FIELDS])
    );

    const [isValid, setIsValid] = useState(false);
    const [credentialData, setCredentialData] = useState<PaginatedDocs<Credential>>();
    const [csvStepIsValid, setCsvStepIsValid] = useState(false);
    const [emailStepIsValid, setEmailStepIsValid] = useState(false);

    const valuesWithValidators = getFieldValuesWithValidators(
        currentPage + 1,
        fields,
        collection.fields
    );
    const values = valuesWithValidators.map(({ value }) => value);

    const fetchCsvFields = async () => {
        const response = await fetch('/api/get-batch-fields', {
            method: 'POST',
            body: JSON.stringify({ id }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });

        if (response.status === 200) {
            const newFields = await response.json();

            setCsvFields(dedupe([...newFields, ...GENERATED_FIELDS]));
        }
    };

    const fetchBatchCredentials = async (page = 1) => {
        fetchCsvFields();
        const response = await fetch('/api/get-batch-credentials', {
            method: 'POST',
            body: JSON.stringify({ batchId: id, page }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });

        if (response.status === 200) {
            const { data } = await response.json();

            setCredentialData(data);
        }
    };

    useEffect(() => {
        fetchBatchCredentials();
    }, []);

    useEffect(() => {
        isStepValid(valuesWithValidators).then(setIsValid);
    }, [values.join(',')]);

    // This effect sets the current page on mount
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const page = searchParams.get('page');

        if (page && page !== currentPage.toString()) scrollTo[Number(page)]?.(false);
    }, []);

    // This effect updates the URL whenever currentPage changes
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);

        searchParams.set('page', currentPage.toString());
        setTimeout(() => history.replace({ search: searchParams.toString() }), 300);
    }, [currentPage, history, location.search]);

    const handleNextStep = async () => {
        if (currentPage === 4 || !isValid) return submit();

        goForward(false);
    };

    const duplicate = async () => {
        const result = await fetch(`/api/credential-batch/${id}/duplicate`, { method: 'POST' });

        if (result.status === 200) {
            const newBatch = await result.json();

            history.push(`${adminRoute}/collections/credential-batch/${newBatch.id}`);
        }
    };

    return (
        <>
            <section className="h-full w-full snap-mandatory snap-x overflow-x-hidden flex-shrink pt-12 flex md:pt-0">
                <RenderSlide ref={refs[0]} formProps={props} step={1} />
                <RenderSlide ref={refs[1]} formProps={props} step={2} />
                <UploadCSV
                    ref={refs[2]}
                    formProps={props}
                    setIsValid={setCsvStepIsValid}
                    csvFields={csvFields}
                    setCsvFields={setCsvFields}
                    refetchBatchCredentials={fetchBatchCredentials}
                    credentialData={credentialData}
                />
                <SelectEmailTemplate
                    ref={refs[3]}
                    formProps={props}
                    setIsValid={setEmailStepIsValid}
                    csvFields={csvFields}
                />
                <BatchPreviewSubmit
                    ref={refs[4]}
                    credentialData={credentialData}
                    refetchBatchCredentials={fetchBatchCredentials}
                />
            </section>

            <HorizontalNavHeader
                currentPage={currentPage}
                pages={pages}
                className="absolute top-0 right-0 w-auto mt-15 mr-20"
            />

            <HorizontalNavFooter
                mainAction={handleNextStep}
                secondaryAction={props.readOnly ? duplicate : undefined}
                canDoSecondaryAction
                canDoMainAction={
                    isValid &&
                    (currentPage !== 2 || csvStepIsValid) &&
                    (currentPage !== 3 || emailStepIsValid) &&
                    (!props.readOnly || currentPage !== 4)
                }
                secondaryText="Duplicate & Edit"
                goBack={currentPage > 0 ? () => goBack(false) : undefined}
                mainText={currentPage === 4 ? 'Send' : 'Continue'}
                quitText={props.readOnly ? 'Quit' : 'Save as Draft & Quit'}
                quit={() => history.push(`${adminRoute}/collections/credential-batch`)}
            />
        </>
    );
};

const RenderBatchFlowFields: React.FC<Props> = props => {
    const { fieldSchema, className, forceRender } = props;

    const [hasRendered, setHasRendered] = useState(Boolean(forceRender));
    const [intersectionRef, entry] = useIntersect(intersectionObserverOptions);
    const isIntersecting = Boolean(entry?.isIntersecting);
    const isAboveViewport = entry?.boundingClientRect?.top < 0;
    const shouldRender = forceRender || isIntersecting || isAboveViewport;

    useEffect(() => {
        if (shouldRender && !hasRendered) {
            setHasRendered(true);
        }
    }, [shouldRender, hasRendered]);

    const classes = [baseClass, className].filter(Boolean).join(' ');

    if (fieldSchema) {
        return (
            <div ref={intersectionRef} className={classes}>
                {hasRendered && <FormSteps {...props} />}
            </div>
        );
    }

    return null;
};

export default RenderBatchFlowFields;
