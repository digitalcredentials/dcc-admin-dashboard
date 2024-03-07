import React from 'react';
import { Redirect } from 'react-router-dom';

const DashboardRedirect: React.FC = () => {
    return <Redirect to="/admin/collections/credential-batch" />;
};

export default DashboardRedirect;
