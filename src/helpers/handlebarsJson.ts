import { create as createDefaultHandlebars } from 'handlebars';

import { safeJsonParse } from 'better-error-message-for-json-parse';
export interface ITemplateDelegate<T = any> {
    (context: T, options?: IRuntimeOptions): string;
}

export interface IHandlebars {
    create(): IHandlebars;
    compile<T = any>(input: any, options?: ICompileOptions): ITemplateDelegate<T>;
}

export interface IRuntimeOptions {
    partial?: boolean;
    depths?: any[];
    helpers?: { [name: string]: Function };
    partials?: { [name: string]: ITemplateDelegate };
    decorators?: { [name: string]: Function };
    data?: any;
    blockParams?: any[];
}

export interface ICompileOptions {
    data?: boolean;
    compat?: boolean;
    knownHelpers?: {
        helperMissing?: boolean;
        blockHelperMissing?: boolean;
        each?: boolean;
        if?: boolean;
        unless?: boolean;
        with?: boolean;
        log?: boolean;
        lookup?: boolean;
    };
    knownHelpersOnly?: boolean;
    noEscape?: boolean;
    strict?: boolean;
    assumeObjects?: boolean;
    preventIndent?: boolean;
    ignoreStandalone?: boolean;
    explicitPartialContext?: boolean;
}

export function escapeJson(str: any): string {
    str = str ? str.toString() : '';
    return str
        .replace(/\\/g, '\\\\')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/"/g, '\\"')
        .replace(/\r/g, '\\r');
}

export interface IOptions {
    numberOfDebugLinesInError: number;
}

export const defaultNumberOfDebugLines = Object.freeze({
    numberOfDebugLinesInError: 3,
});

/**
 * Creates a JSON version of handlebars.
 *
 * @export
 * @param {IOptions} [options=defaultNumberOfDebugLines] Option to inflence errors.
 * @returns {IHandlebars} The Handlebars object.
 */
export function createJsonHandlebars(options: IOptions = defaultNumberOfDebugLines): IHandlebars {
    const instance = createDefaultHandlebars();
    instance.Utils.escapeExpression = escapeJson;
    (<any>instance).create = createJsonHandlebars;
    (<any>instance).__def__compile = instance.compile;
    (<any>instance).compile = (input: any, options?: ICompileOptions) => {
        const compiled = (<any>instance).__def__compile(input, options);
        return (context: any, options: any): any => {
            let result = compiled(context, options);
            result = reformatJsonString(result);

            try {
                return safeJsonParse(result);
            } catch (ex) {
                ex = changeError(ex, result, options);
                throw ex;
            }
        };
    };
    return instance;
}

function reformatJsonString(str) {
    // replace enters
    str = str.replace(/\r/g, '');

    // skip empty line
    str = str
        .split('\n')
        .filter(l => !/^\s*$/.test(l))
        .join('\n');

    // replace lines that only have a comma - they are hard to debug
    str = str.replace(/\n\s*,\s*\n/g, ',\n');

    return str;
}

function changeError(ex: Error, json: string, options: IOptions) {
    const DIFF = options
        ? options.numberOfDebugLinesInError
            ? options.numberOfDebugLinesInError
            : 3
        : 3;

    let jsons = json.split('\n');
    let messages = ex.message.split('\n');
    let firstMsg = messages.shift();

    let firstRangeEnd = parseInt(messages[1]) - 2;
    let firstRangeStart = firstRangeEnd - DIFF;
    if (firstRangeStart < 0) firstRangeStart = 0;

    for (let index = firstRangeStart; index < firstRangeEnd; index++) {
        let msg = `${index + 1}: ${jsons[index]}`;
        let offset = index - firstRangeStart;
        messages.splice(offset, 0, msg);
    }

    let lastRangeStart = parseInt(messages[messages.length - 1]);
    let lastRangeEnd = lastRangeStart + DIFF;
    if (lastRangeEnd >= jsons.length) lastRangeEnd = jsons.length - 1;

    for (let index = lastRangeStart; index <= lastRangeEnd; index++) {
        let msg = `${index + 1}: ${jsons[index]}`;
        messages.push(msg);
    }

    messages.unshift(firstMsg);
    ex.message = messages.join('\n');

    return ex;
}
