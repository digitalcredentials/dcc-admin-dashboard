import React from 'react';

export type CheckProps = {
    className?: string;
};

const Check: React.FC<CheckProps> = ({ className = '' }) => {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 40 40"
            fill="none"
        >
            <path
                d="M33.3337 10L15.0003 28.3333L6.66699 20"
                stroke="currentcolor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default Check;
