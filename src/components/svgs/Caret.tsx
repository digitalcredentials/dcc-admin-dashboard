import React from 'react';

export type CaretProps = {
    className?: string;
};

const Caret: React.FC<CaretProps> = ({ className = '' }) => {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="none"
        >
            <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentcolor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default Caret;
