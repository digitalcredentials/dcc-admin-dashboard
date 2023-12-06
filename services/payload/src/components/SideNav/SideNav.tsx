import React, { useState } from 'react';
import { Flipper, Flipped } from 'react-flip-toolkit';
import './SideNav.scss';
import { Link, NavLink } from 'react-router-dom';
import { useConfig } from 'payload/dist/admin/components/utilities/Config';
import Logout from '../Logout/Logout';
import Account from '../Account/Account';
import { useAuth } from 'payload/dist/admin/components/utilities/Auth';

import Logo from '../../assets/tdm-alt-logo.png';
import SmallLogo from '../../assets/tdm-logo.png';
import ListChecks from '../../assets/list-checks.svg';
import FileCheck from '../../assets/file-check.svg';
import FileEdit from '../../assets/file-edit.svg';
import MailPlus from '../../assets/mail-plus.svg';
import Users from '../../assets/users.svg';
import Caret from '../svgs/Caret';

const SideNav: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();

    const close = () => setIsOpen(false);

    const {
        routes: { admin },
    } = useConfig();

    return (
        <nav className={`navbar-wrapper relative ${isOpen ? 'open' : ''}`}>
            <header>
                <button
                    className="flex px-5 py-1 bg-slate-100 rounded-3xl shadow-[0_4px_4px_0_rgba(0,0,0,.25)] relative dark:bg-slate-800"
                    onClick={() => setIsOpen(!isOpen)}
                    type="button"
                >
                    <Caret
                        className={`w-5 h-5 ${isOpen ? '-rotate-90' : 'rotate-90'
                            } -mr-1 transition-transform`}
                    />
                    <Caret
                        className={`w-5 h-5 ${isOpen ? 'rotate-90' : '-rotate-90'
                            } -ml-1 transition-transform`}
                    />
                </button>

                <img className="h-15" src={isOpen ? Logo : SmallLogo} alt="Digital Credentials Consortium logo" />
            </header>

            <section>
                <NavLink
                    className={`navbar-buttons ${isOpen ? 'open' : ''}`}
                    to="/admin/collections/credential-batch"
                    onClick={close}
                >
                    <img src={ListChecks} alt="credential-batch" />{' '}
                    <span className={`transition-[font-size] ${isOpen ? '' : 'text-zero'}`}>
                        Issuance Overview
                    </span>
                </NavLink>

                <NavLink
                    className={`navbar-buttons ${isOpen ? 'open' : ''}`}
                    to="/admin/collections/credential"
                    onClick={close}
                >
                    <img src={FileCheck} alt="credential" />
                    <span className={`transition-[font-size] ${isOpen ? '' : 'text-zero'}`}>
                        Credentials
                    </span>
                </NavLink>

                <NavLink
                    className={`navbar-buttons ${isOpen ? 'open' : ''}`}
                    to="/admin/collections/credential-template"
                    onClick={close}
                >
                    <img src={FileEdit} alt="credential-template" />{' '}
                    <span className={`transition-[font-size] ${isOpen ? '' : 'text-zero'}`}>
                        Credential Templates
                    </span>
                </NavLink>

                <NavLink
                    className={`navbar-buttons ${isOpen ? 'open' : ''}`}
                    to="/admin/collections/email-template"
                    onClick={close}
                >
                    <img src={MailPlus} alt="email-template" />
                    <span className={`transition-[font-size] ${isOpen ? '' : 'text-zero'}`}>
                        Email Templates
                    </span>
                </NavLink>

                <NavLink
                    className={`navbar-buttons ${isOpen ? 'open' : ''}`}
                    to="/admin/collections/users"
                    onClick={close}
                >
                    <img src={Users} alt="users" />
                    <span className={`transition-[font-size] ${isOpen ? '' : 'text-zero'}`}>
                        Credentials
                    </span>
                </NavLink>
            </section>

            <footer className="flex flex-col gap-8">
                <section>
                    <Link
                        to={`${admin}/account`}
                        className={`flex justify-center transition-[gap] ${isOpen ? 'gap-5' : 'gap-0'
                            }`}
                        onClick={close}
                    >
                        <Account className="w-15 h-15 border border-slate-50 rounded-full shadow-fours" />
                        <section className="flex flex-col">
                            <p
                                className={`text-start m-0 transition-[font-size] font-inter text-lg font-medium ${isOpen ? '' : 'text-zero'
                                    }`}
                            >
                                {user.name}
                            </p>
                            <p
                                className={`text-start text-base m-0 transition-[font-size] ${isOpen ? '' : 'text-zero'
                                    }`}
                            >
                                {user.email}
                            </p>
                        </section>
                    </Link>
                </section>

                <section>
                    <Logout
                        onClick={close}
                        className={`flex justify-center transition-[gap] ${isOpen ? 'gap-2' : 'gap-0'
                            }`}
                        textClassName={`text-xl transition-[font-size] ${isOpen ? '' : 'text-zero'
                            }`}
                    />
                </section>
            </footer>
        </nav>
    );
};

export default SideNav;
