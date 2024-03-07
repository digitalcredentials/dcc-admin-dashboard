import React, { useState, useEffect } from 'react';
import { RenderFieldProps as Props } from '../types';
import RenderCustomComponent from 'payload/dist/admin/components/utilities/RenderCustomComponent';
import { useField } from 'payload/components/forms';
import { EmailTemplate } from 'payload/generated-types';
import {
    getFieldsFromHandlebarsJsonTemplate,
    getFieldsIntersectionFromHandlebarsJsonTemplate,
} from '../../helpers/handlebarhelpers';
import { GENERATED_EMAIL_FIELDS, GUARANTEED_EMAIL_FIELDS } from '../../helpers/credential.helpers';
import CircleCheck from '../svgs/CircleCheck';
import CircleBang from '../svgs/CircleBang';
import { dedupe } from '../../helpers/array.helpers';

export type SelectEmailTemplateProps = {
    formProps: Props;
    csvFields: string[];
    setIsValid: React.Dispatch<React.SetStateAction<boolean>>;
};

const SelectEmailTemplate = React.forwardRef<HTMLElement, SelectEmailTemplateProps>(
    function UploadCSV({ formProps, setIsValid, csvFields }, ref) {
        const { value: templateId } = useField<string>({ path: 'emailTemplate' });

        const [template, setTemplate] = useState<EmailTemplate | undefined>();
        const [templateFields, setTemplateFields] = useState<string[]>([]);

        const fieldsIntersection = getFieldsIntersectionFromHandlebarsJsonTemplate(
            dedupe([...csvFields, ...GENERATED_EMAIL_FIELDS]),
            templateFields
        );

        const {
            fieldSchema,
            fieldTypes,
            permissions,
            readOnly,
            indexPath: incomingIndexPath,
        } = formProps;

       // const fromSchema = fieldSchema.find(field => field.name === 'from');
        const emailTemplateSchema = fieldSchema.find(field => field.name === 'emailTemplate');

        useEffect(() => {
            if (templateId) {
                fetch(`/api/email-template/${templateId}`)
                    .then(res => res.json())
                    .then(setTemplate);
            }
        }, [templateId]);

        useEffect(() => {
            if (template) {
                setTemplateFields(
                    dedupe([
                        ...getFieldsFromHandlebarsJsonTemplate(JSON.stringify(template)),
                        ...GUARANTEED_EMAIL_FIELDS,
                    ])
                );
            }
        }, [template]);

        useEffect(
            () => setIsValid(template && fieldsIntersection.missingInCSV.length === 0),
            [template, fieldsIntersection.missingInCSV.length]
        );

        return (
            <section
                ref={ref}
                className="w-full h-full snap-start flex-shrink-0 p-10 overflow-y-auto upload-csv-wrapper"
            >
                <h2 className="mt-5 text-[--theme-text] text-3xl font-semibold mb-5 font-inter">
                    Select Email Template
                </h2>
                <p className="text-[--theme-text] text-xl font-medium font-inter mb-15">
                    Select an email template to be sent to the earners.
                </p>

                {template &&
                    (fieldsIntersection.missingInCSV.length > 0 ? (
                        <output className="flex gap-2 items-center flex-wrap rounded bg-red-400 text-black font-roboto px-6 py-2 my-3">
                            <CircleBang className="w-5 h-5" />
                            <span>CSV is missing the following fields:</span>
                            <span className="font-bold">
                                {fieldsIntersection.missingInCSV.join(', ')}.
                            </span>
                        </output>
                    ) : (
                        <output className="flex gap-2 items-center bg-green-200 text-black font-roboto px-6 py-2 my-3">
                            <CircleCheck className="w-5 h-5" />
                            <span>CSV contains all fields.</span>
                        </output>
                    ))}

                {template &&
                    (fieldsIntersection.missingInTemplate.length > 0 ? (
                        <output className="flex gap-2 items-center flex-wrap rounded bg-orange-400 text-black font-roboto px-6 py-2 my-3">
                            <CircleBang className="w-5 h-5" />
                            <span>
                                Template is missing the following fields that were in the CSV:
                            </span>
                            <span className="font-bold">
                                {fieldsIntersection.missingInTemplate.join(', ')}.
                            </span>
                        </output>
                    ) : (
                        <output className="flex gap-2 items-center rounded bg-green-200 text-black font-roboto px-6 py-2 my-3">
                            <CircleCheck className="w-5 h-5" />
                            <span>Template is using all fields that were in the CSV.</span>
                        </output>
                    ))}

                <RenderCustomComponent
                    CustomComponent={emailTemplateSchema?.admin?.components?.Field}
                    DefaultComponent={fieldTypes[emailTemplateSchema.type]}
                    componentProps={{
                        ...emailTemplateSchema,
                        path: emailTemplateSchema.path || 'emailTemplate',
                        fieldTypes,
                        indexPath: incomingIndexPath ? `${incomingIndexPath}.1` : '1',
                        admin: {
                            ...(emailTemplateSchema.admin || {}),
                            readOnly,
                        },
                        permissions: permissions?.[emailTemplateSchema.name],
                    }}
                />
            </section>
        );
    }
);

export default SelectEmailTemplate;
