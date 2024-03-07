import React, { useState, useEffect, ChangeEventHandler } from 'react';
import Papa from 'papaparse';
import { useField } from 'payload/components/forms';
import Label from 'payload/dist/admin/components/forms/Label';
import FieldDescription from 'payload/dist/admin/components/forms/FieldDescription';
import {
    getFieldsFromHandlebarsJsonTemplate,
    getFieldsIntersectionFromHandlebarsJsonTemplate,
} from '../../helpers/handlebarhelpers';
import { GENERATED_EMAIL_FIELDS, GUARANTEED_EMAIL_FIELDS } from '../../helpers/credential.helpers';
import CircleCheck from '../svgs/CircleCheck';
import CircleBang from '../svgs/CircleBang';
import { dedupe } from '../../helpers/array.helpers';

export type ValidateWithCsvProps = {
    path: string;
};

const ValidateWithCsv: React.FC<ValidateWithCsvProps> = ({ path }) => {
    const [csvFields, setCsvFields] = useState<string[]>();
    const [templateFields, setTemplateFields] = useState<string[]>([]);
    const { value: template } = useField<string>({ path });
    const { value: title } = useField<string>({ path: 'title' });

    const fieldsIntersection = getFieldsIntersectionFromHandlebarsJsonTemplate(
        csvFields ?? [],
        templateFields
    );

    useEffect(() => {
        if (template) {
            setTemplateFields(
                dedupe([
                    ...getFieldsFromHandlebarsJsonTemplate(template),
                    ...GUARANTEED_EMAIL_FIELDS,
                ])
            );
        }
    }, [template]);

    const parseCsv: ChangeEventHandler<HTMLInputElement> = event => {
        Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: async results => {
                if (results?.errors?.length === 0) {
                    setCsvFields(
                        dedupe([...(results?.meta?.fields ?? []), ...GUARANTEED_EMAIL_FIELDS])
                    );
                }
            },
        });
    };

    const generateCsv = () => {
        const csvContent =
            templateFields.filter(field => !GENERATED_EMAIL_FIELDS.includes(field)).join(',') +
            '\n';

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });

        // Pretend to click on a link for the user to prompt download
        const link = document.createElement('a');

        link.setAttribute('download', `${title ?? 'template'}.csv`);

        link.href = URL.createObjectURL(blob);

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    };

    return (
        <section className="w-full mt-5">
            {csvFields &&
                (fieldsIntersection.missingInTemplate.length > 0 ? (
                    <output className="flex gap-2 items-center flex-wrap rounded bg-red-400 text-black font-roboto px-6 py-2 my-3 mb-8">
                        <CircleBang className="w-5 h-5" />
                        <span>Template is missing the following fields that were in the CSV:</span>
                        <span className="font-bold">
                            {fieldsIntersection.missingInTemplate.join(', ')}.
                        </span>
                    </output>
                ) : (
                    <output className="flex gap-2 items-center bg-green-200 text-black font-roboto px-6 py-2 my-3 mb-8">
                        <CircleCheck className="w-5 h-5" />
                        <span>Template is using all fields that were in the CSV.</span>
                    </output>
                ))}

            <Label htmlFor={`field-${path}`} label="Validate with CSV" />
            <FieldDescription
                value={template}
                description="Check your email template against a sample CSV to ensure all fields are covered."
                className="text-black"
            />

            <form>
                <input
                    type={'file'}
                    id={'csvFileInput'}
                    accept={'.csv'}
                    onChange={parseCsv}
                    className="upload-csv-input"
                />
            </form>

            {csvFields &&
                (fieldsIntersection.missingInCSV.length > 0 ? (
                    <output className="flex gap-2 items-center flex-wrap rounded bg-red-400 text-black font-roboto px-6 py-2 my-3">
                        <CircleBang className="w-5 h-5" />
                        <span>CSV is missing the following fields:</span>
                        <span className="font-bold">
                            {fieldsIntersection.missingInCSV.join(', ')}.
                        </span>
                    </output>
                ) : (
                    <output className="flex gap-2 items-center rounded bg-green-200 text-black font-roboto px-6 py-2 my-3">
                        <CircleCheck className="w-5 h-5" />
                        <span>CSV contains all fields.</span>
                    </output>
                ))}

            <button
                type="button"
                onClick={generateCsv}
                className="w-full max-w-xs bg-green-500 rounded-xl mt-8 px-4 py-2 text-white font-inter text-xl font-semibold outline-none justify-self-end disabled:opacity-50"
            >
                Generate Empty CSV
            </button>
        </section>
    );
};

export default ValidateWithCsv;
