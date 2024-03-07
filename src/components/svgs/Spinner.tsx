import React from 'react';

export type SpinnerProps = {
    className?: string;
};

const Spinner: React.FC<SpinnerProps> = ({ className = '' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="none"
            className={className}
        >
            <path
                d="M14 8.00005C13.9999 9.26711 13.5988 10.5016 12.854 11.5267C12.1092 12.5517 11.059 13.3147 9.85392 13.7062C8.64886 14.0977 7.3508 14.0976 6.14576 13.7061C4.94073 13.3145 3.89059 12.5515 3.14584 11.5264C2.4011 10.5013 1.99999 9.26677 2 7.99971C2.00001 6.73265 2.40114 5.49812 3.14589 4.47305C3.89065 3.44798 4.9408 2.68499 6.14584 2.29343C7.35088 1.90188 8.64895 1.90186 9.854 2.29338"
                stroke="currentcolor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default Spinner;
