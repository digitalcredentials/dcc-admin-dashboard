import React, { useState } from 'react';
import { Flipper, Flipped } from 'react-flip-toolkit';
import './SideNav.scss';
import { Link, NavLink } from 'react-router-dom';
import { useConfig } from 'payload/dist/admin/components/utilities/Config';
import Logout from '../Logout/Logout';
import Account from '../Account/Account';
import { useAuth } from 'payload/dist/admin/components/utilities/Auth';

import Logo from '../../assets/tdm-alt-logo.png';
import ListChecks from '../../assets/list-checks.svg';
import FileCheck from '../../assets/file-check.svg';
import FileEdit from '../../assets/file-edit.svg';
import MailPlus from '../../assets/mail-plus.svg';
import Users from '../../assets/users.svg';
import Caret from '../svgs/Caret';

const SideNav: React.FC = () => {
   
    const { user } = useAuth();

    const {
        routes: { admin },
    } = useConfig();

    return (
        <nav className={`navbar-wrapper relative open'`}>
            <header>
                <img className="h-15" src={Logo} alt="Digital Credentials Consortium logo" />
            </header>

            <section>
                <NavLink
                    className={`navbar-buttons open`}
                    to="/admin/collections/credential-batch"
                    onClick={close}
                >
                    <img src={ListChecks} alt="credential-batch" />{' '}
                    <span className={`transition-[font-size]`}>
                        Issuance Overview
                    </span>
                </NavLink>

                <NavLink
                    className={`navbar-buttons open`}
                    to="/admin/collections/credential"
                    onClick={close}
                >
                    <img src={FileCheck} alt="credential" />
                    <span className={`transition-[font-size]`}>
                        Credentials
                    </span>
                </NavLink>

                <NavLink
                    className={`navbar-buttons open`}
                    to="/admin/collections/credential-template"
                    onClick={close}
                >
                    <img src={FileEdit} alt="credential-template" />{' '}
                    <span className={`transition-[font-size]`}>
                        Credential Templates
                    </span>
                </NavLink>

                <NavLink
                    className={`navbar-buttons open`}
                    to="/admin/collections/email-template"
                    onClick={close}
                >
                    <img src={MailPlus} alt="email-template" />
                    <span className={`transition-[font-size]`}>
                        Email Templates
                    </span>
                </NavLink>

                <NavLink
                    className={`navbar-buttons open`}
                    to="/admin/collections/users"
                    onClick={close}
                >
                    <img src={Users} alt="users" />
                    <span className={`transition-[font-size]`}>
                        Users
                    </span>
                </NavLink>
            </section>

            <footer className="flex flex-col gap-8">
                <section>
                    <Link
                        to={`${admin}/account`}
                        className={`flex justify-center transition-[gap] gap-5`}
                        onClick={close}
                    >
                        <Account className="w-15 h-15 border border-slate-50 rounded-full shadow-fours" />
                        <section className="flex flex-col">
                            <p
                                className={`text-start m-0 transition-[font-size] font-inter text-lg font-medium`}
                            >
                                {user.name}
                            </p>
                            <p
                                className={`text-start text-base m-0 transition-[font-size]`}
                            >
                                {user.email}
                            </p>
                        </section>
                    </Link>
                </section>

                <section>
                    <Logout
                        
                        className={`flex justify-center transition-[gap] gap-2`}
                        textClassName={`text-xl transition-[font-size]`}
                    />
                </section>
            </footer>
        </nav>
    );
};

export default SideNav;
