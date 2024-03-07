import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RenderCustomComponent from 'payload/dist/admin/components/utilities/RenderCustomComponent';
import useIntersect from 'payload/dist/admin/hooks/useIntersect';
import { RenderFieldProps as Props } from '../types';
import { fieldAffectsData, fieldIsPresentationalOnly } from 'payload/dist/fields/config/types';
import { useOperation } from 'payload/dist/admin/components/utilities/OperationProvider/index';
import { getTranslation } from 'payload/dist/utilities/getTranslation';
import { useForm } from 'payload/components/forms';

import HorizontalNavFooter from '../navigation/HorizontalNavFooter';
import { useConfig } from 'payload/components/utilities';

const baseClass = 'render-fields';

const intersectionObserverOptions = { rootMargin: '1000px' };

type RenderSlideProps = {
    formProps: Props;
    children: React.ReactNode;
};

const RenderSlide = React.forwardRef<HTMLElement, RenderSlideProps>(function RenderSlide(
    { formProps, children },
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

    const renderFields = fieldSchema?.map((field, fieldIndex) => {
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

    return (
        <section
            ref={ref}
            className="batch-flow-slide w-full h-full flex-shrink-0 px-20 pb-10 pt-15 overflow-y-auto"
        >
            <h2 className="mt-5 text-[--theme-text] text-3xl font-semibold mb-5 font-inter">
                Create User
            </h2>

            {renderFields}
            {children}
        </section>
    );
});

const FormSteps: React.FC<Props & { children: React.ReactNode }> = props => {
    const history = useHistory();

    const { submit } = useForm();

    const {
        routes: { admin: adminRoute },
    } = useConfig();

    return (
        <>
            <section className="h-full w-full overflow-x-hidden flex-shrink pt-12 flex md:pt-0">
                <RenderSlide formProps={props}>{props.children}</RenderSlide>
            </section>

            <HorizontalNavFooter
                mainAction={() =>
                    submit().then(() => history.push(`${adminRoute}/collections/users`))
                }
                canDoMainAction
                mainText="Save and Quit"
                quitText="Quit Without Saving"
                showAutosave={false}
                quit={() => history.push(`${adminRoute}/collections/users`)}
            />
        </>
    );
};

const RenderUserFlowFields: React.FC<Props & { children: React.ReactNode }> = props => {
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

export default RenderUserFlowFields;
