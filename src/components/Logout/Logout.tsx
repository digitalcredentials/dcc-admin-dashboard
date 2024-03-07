import React from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from 'payload/dist/admin/components/utilities/Config';
import LogOut from 'payload/dist/admin/components/icons/LogOut';

const baseClass = 'nav';

export type LogoutProps = {
    className?: string;
    textClassName?: string;
    onClick?: () => void;
};

const Logout: React.FC<LogoutProps> = ({ className = '', textClassName = '', onClick }) => {
    const config = useConfig();
    const {
        routes: { admin },
        admin: { logoutRoute },
    } = config;

    return (
        <Link
            onClick={onClick}
            to={`${admin}${logoutRoute}`}
            className={`${baseClass}__log-out ${className}`}
        >
            <LogOut />
            <p className={textClassName}>Logout</p>
        </Link>
    );
};

export default Logout;
