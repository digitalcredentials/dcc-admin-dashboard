import React from 'react';
import { Flipper, Flipped } from 'react-flip-toolkit';
import { useDocumentInfo } from 'payload/components/utilities';
import { useField } from 'payload/components/forms';

import Arrow from '../svgs/Arrow';

import './navigation.scss';
import Autosave from 'payload/dist/admin/components/elements/Autosave';
import LeaveWithoutSaving from 'payload/dist/admin/components/modals/LeaveWithoutSaving';

type HorizontalNavFooterProps = {
    mainAction?: () => void;
    canDoMainAction?: boolean;
    secondaryAction?: () => void;
    canDoSecondaryAction?: boolean;
    goForward?: () => void;
    goBack?: () => void;
    quit?: () => void;
    mainText?: string;
    secondaryText?: string;
    quitText?: string;
    className?: string;
    tag?: keyof JSX.IntrinsicElements;
    showAutosave?: boolean;
};

const HorizontalNavFooter: React.FC<HorizontalNavFooterProps> = ({
    mainAction = () => { },
    canDoMainAction = true,
    secondaryAction,
    canDoSecondaryAction = true,
    goForward,
    goBack,
    quit,
    mainText = 'Continue',
    secondaryText = '',
    quitText = 'Quit',
    className = '',
    tag = 'footer',
    showAutosave = true,
}) => {
    const { publishedDoc, collection, id } = useDocumentInfo();
    const { value: createdAt } = useField<string>({ path: 'createdAt' });

    return (
        <Flipper
            element={tag}
            flipKey={`${Boolean(goBack)}-${canDoMainAction}`}
            className={`horizontal-nav-footer w-full flex flex-col md:flex-row items-center p-5 bg-[--theme-bg] border-t gap-5 ${className}`}
        >
            {goBack && (
                <Flipped flipId="back-button">
                    <button
                        type="button"
                        className="w-11 h-11 shadow rounded-full bg-[--theme-bg] flex items-center justify-center outline-none"
                        onClick={goBack}
                    >
                        <Arrow className="text-green-500 w-6 h-6" />
                    </button>
                </Flipped>
            )}

            {showAutosave ? (
                <Flipped flipId="autosave">
                    <span className="flex flex-grow font-inter text-slate-700 text-base dark:text-slate-300">
                        <Autosave
                            publishedDocUpdatedAt={publishedDoc?.updatedAt || createdAt}
                            collection={collection}
                            id={id}
                        />
                    </span>
                </Flipped>
            ) : (
                <Flipped flipId="autosave">
                    <span className="flex flex-grow font-inter text-slate-700 text-base dark:text-slate-300">
                        <LeaveWithoutSaving />
                    </span>
                </Flipped>
            )}

            {quit && (
                <Flipped flipId="quit-button">
                    <button
                        className="flex-grow max-w-xs bg-transparent rounded-xl px-4 py-2 border-2 border-slate-500 text-slate-500 font-inter text-xl font-semibold outline-none justify-self-end"
                        type="button"
                        onClick={quit}
                    >
                        {quitText}
                    </button>
                </Flipped>
            )}

            {secondaryAction && (
                <Flipped flipId="secondary-action-button">
                    <button
                        className="flex-grow max-w-xs bg-green-500 rounded-xl px-4 py-2 text-white font-inter text-xl font-semibold outline-none justify-self-end disabled:opacity-50"
                        type="button"
                        onClick={secondaryAction}
                        disabled={!canDoSecondaryAction}
                    >
                        {secondaryText}
                    </button>
                </Flipped>
            )}

            <Flipped flipId="main-action-button">
                <button
                    className="flex-grow max-w-xs bg-green-500 rounded-xl px-4 py-2 text-white font-inter text-xl font-semibold outline-none justify-self-end disabled:opacity-50"
                    type="button"
                    onClick={mainAction}
                    disabled={!canDoMainAction}
                >
                    {mainText}
                </button>
            </Flipped>

            {goForward && (
                <Flipped flipId="back-button">
                    <button
                        type="button"
                        className="w-11 h-11 shadow rounded-full bg-[--theme-bg] flex items-center justify-center outline-none"
                        onClick={goForward}
                    >
                        <Arrow className="text-green-500 w-6 h-6 rotate-180" />
                    </button>
                </Flipped>
            )}
        </Flipper>
    );
};

export default HorizontalNavFooter;
