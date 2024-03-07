import React from 'react';

export type ArrowProps = {
    className?: string;
};

const Arrow: React.FC<ArrowProps> = ({ className = '' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className={className}
        >
            <path
                d="M9.71729 5L3.00021 12L9.71729 19"
                stroke="currentcolor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <line
                x1="1"
                y1="-1"
                x2="16.7331"
                y2="-1"
                transform="matrix(1 0 0 -1 3.26709 11.0317)"
                stroke="currentcolor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
};

export default Arrow;
