import React, { useCallback, useEffect, useState } from 'react';

import Error from 'payload/dist/admin/components/forms/Error';
import FieldDescription from 'payload/dist/admin/components/forms/FieldDescription';
import { code } from 'payload/dist/fields/validations';
import Label from 'payload/dist/admin/components/forms/Label';
import { Props } from 'payload/dist/admin/components/forms/field-types/Code/types';
import { useField } from 'payload/components/forms';
import withCondition from 'payload/dist/admin/components/forms/withCondition';
import { CodeEditor } from 'payload/dist/admin/components/elements/CodeEditor';
import ValidateWithCsv from './ValidateWithCsv';
import CircleBang from '../svgs/CircleBang';

const prismToMonacoLanguageMap = {
    js: 'javascript',
    ts: 'typescript',
};

const baseClass = 'code-field';

const Code: React.FC<Props> = props => {
    const {
        path: pathFromProps,
        name,
        required,
        validate = code,
        admin: {
            readOnly,
            style,
            className,
            width,
            language,
            description,
            condition,
            editorOptions,
        } = {},
        label,
    } = props;

    const path = pathFromProps || name;

    const memoizedValidate = useCallback(
        (value, options) => {
            return validate(value, { ...options, required });
        },
        [validate, required]
    );

    const { value, showError, setValue, errorMessage } = useField({
        path,
        validate: memoizedValidate,
        condition,
    });

    const classes = [
        baseClass,
        'field-type',
        className,
        showError && 'error',
        readOnly && 'read-only',
    ]
        .filter(Boolean)
        .join(' ');

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
            <CodeEditor
                options={editorOptions}
                defaultLanguage={prismToMonacoLanguageMap[language] || language}
                value={(value as string) || ''}
                onChange={readOnly ? () => null : val => setValue(val)}
                readOnly={readOnly}
            />
            {value && <ValidateWithCsv path={path} />}
        </div>
    );
};

export default withCondition(Code);
