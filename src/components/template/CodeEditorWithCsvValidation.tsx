import React, { useCallback, useEffect, useState } from 'react';

import Error from 'payload/dist/admin/components/forms/Error';
import FieldDescription from 'payload/dist/admin/components/forms/FieldDescription';
import { json } from 'payload/dist/fields/validations';
import Label from 'payload/dist/admin/components/forms/Label';
import { Props } from 'payload/dist/admin/components/forms/field-types/JSON/types';
import { useField } from 'payload/components/forms';
import withCondition from 'payload/dist/admin/components/forms/withCondition';
import { CodeEditor } from 'payload/dist/admin/components/elements/CodeEditor';
import ValidateWithCsv from './ValidateWithCsv';
import CircleBang from '../svgs/CircleBang';

const baseClass = 'json-field';

const getOverwrittenFields = (value: Record<string, any>): string[] => {
    const fields: string[] = [];

    if (value?.id) fields.push('id');
    if (value?.issuer?.id) fields.push('issuer.id');
    if (value?.credentialSubject?.id) fields.push('credentialSubject.id');
    if (value?.issuanceDate) fields.push('issuanceDate');

    return fields;
};

const JSONField: React.FC<Props> = props => {
    const {
        path: pathFromProps,
        name,
        required,
        validate = json,
        admin: { readOnly, style, className, width, description, condition, editorOptions } = {},
        label,
    } = props;

    const path = pathFromProps || name;
    const [stringValue, setStringValue] = useState<string>();
    const [jsonError, setJsonError] = useState<string>();

    const memoizedValidate = useCallback(
        (value, options) => {
            return validate(value, { ...options, required, jsonError });
        },
        [validate, required, jsonError]
    );

    const { value, initialValue, showError, setValue, errorMessage } = useField<{
        value: Record<string, any>;
    }>({
        path,
        validate: memoizedValidate,
        condition,
    });

    const handleChange = useCallback(
        val => {
            if (readOnly) return;
            setStringValue(val);

            try {
                setValue(JSON.parse(val.trim() || '{}'));
                setJsonError(undefined);
            } catch (e) {
                setJsonError(e);
            }
        },
        [readOnly, setValue, setStringValue]
    );

    useEffect(() => {
        setStringValue(JSON.stringify(initialValue, null, 2));
    }, [initialValue]);

    const classes = [
        baseClass,
        'field-type',
        className,
        showError && 'error',
        readOnly && 'read-only',
    ]
        .filter(Boolean)
        .join(' ');

    const overwrittenFields = getOverwrittenFields(value);

    return (
        <div
            className={classes}
            style={{
                ...style,
                width,
            }}
        >
            <Error showError={showError} message={errorMessage} />
            <Label htmlFor={`field-${path}`} label={label} required={required} />
            <FieldDescription value={value} description={description} className="text-black" />
            <p className="flex gap-2 items-center flex-wrap rounded bg-blue-200 text-black font-roboto px-6 py-2 my-3">
                <CircleBang className="w-5 h-5" />
                <span>
                    The following JSON fields will be overwritten, so you do not need to include
                    them: <code className="rounded bg-gray-100 p-1">id</code>,{' '}
                    <code className="rounded bg-gray-100 p-1">issuer.id</code>,{' '}
                    <code className="rounded bg-gray-100 p-1">credentialSubject.id</code>,{' '}
                    <code className="rounded bg-gray-100 p-1">issuanceDate</code>
                </span>
            </p>
            {overwrittenFields.length > 0 && (
                <p className="flex gap-2 items-center flex-wrap rounded bg-orange-400 text-black font-roboto px-6 py-2 my-3">
                    <CircleBang className="w-5 h-5" />
                    <span>
                        <b>Warning:</b> You are using the following fields that will be overwritten:{' '}
                        {overwrittenFields.map((field, index) => (
                            <>
                                <code className="rounded bg-gray-100 p-1">{field}</code>
                                {index === overwrittenFields.length - 1 ? '' : ', '}
                            </>
                        ))}
                    </span>
                </p>
            )}
            <CodeEditor
                options={editorOptions}
                defaultLanguage="json"
                value={stringValue}
                onChange={handleChange}
                readOnly={readOnly}
            />
            {stringValue && <ValidateWithCsv path={path} />}
        </div>
    );
};

export default withCondition(JSONField);
