import React, { useState, useEffect } from 'react';
import { useConfig } from 'payload/dist/admin/components/utilities/Config';
import { Link } from 'react-router-dom';
import './template.scss';
import { totalCredentialTemplatePublishedQuery } from '../../constants/countQueries';

const TemplatePageDescription: React.FC = () => {
    const {
        routes: { admin: adminRoute },
    } = useConfig();

    const [count, setCount] = useState<number | undefined>(0);

    const fetchBatchCredentials = async (page = 1) => {
        const res = await fetch('/api/get-collection-count', {
            method: 'POST',
            body: JSON.stringify({
                collectionName: 'credential-template',
                query: totalCredentialTemplatePublishedQuery,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        if (res.status === 200) {
            const data = await res.json();

            setCount(data?.count);
        }
    };

    useEffect(() => {
        fetchBatchCredentials();
    }, []);

    return (
        <div className="header_wrapper">
            <p className="header_paragraph">
                <span className="header_number">{count}</span> Published Templates
            </p>

            <Link
                className="header_template_button"
                activeClassName="active"
                to={`${adminRoute}/collections/credential-template/create`}
            >
                <img className="plus_icon" src="/assets/plus-icon.svg" alt="plus icon" />
                Create New Template
            </Link>
        </div>
    );
};

export default TemplatePageDescription;
