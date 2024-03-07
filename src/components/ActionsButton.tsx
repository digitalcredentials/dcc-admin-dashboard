import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useModal } from '@faceless-ui/modal';
import { useConfig } from 'payload/components/utilities';
import { Props } from 'payload/components/views/Cell';

import Caret from './svgs/Caret';
import Eye from './svgs/Eye';
import Send from './svgs/Send';
import ArrowArcLeft from './svgs/ArrowArcLeft';
import BarGraph from './svgs/BarGraph';
import RevocationWarning from './credential/RevocationWarning';
import { Credential } from 'payload/generated-types';
import { CREDENTIAL_STATUS } from '../constants/credentials';
import RevocationDetails from './credential/RevocationDetails';
import X from './svgs/X';

type ActionButton =
    | { type: 'button'; label: string; icon: React.ReactNode; onClick: () => void | Promise<void> }
    | { type: 'link'; label: string; icon: React.ReactNode; url: string };

const ActionsButton: React.FC<
    Props & { simple?: boolean; onDelete?: () => Promise<void>; readOnly?: boolean }
> = ({ rowData, simple = false, readOnly = false, onDelete }) => {
    const {
        routes: { admin: adminRoute },
    } = useConfig();
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState<'absolute' | 'fixed'>('absolute');
    const container = useRef<HTMLElement>();
    const { openModal } = useModal();

    const isRevoked = rowData.status === CREDENTIAL_STATUS.REVOKED;
    const revocationSlug = `revocation-${isRevoked ? 'details' : 'warning'}-${rowData.id}`;

    useEffect(() => {
        function close(event: MouseEvent) {
            if (container.current && !container.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) document.addEventListener('mousedown', close);
        else document.removeEventListener('mousedown', close);

        return () => document.removeEventListener('mousedown', close);
    }, [isOpen]);

    // Solving for a weird case here where we want it to break out of the scroll container if we can
    useEffect(() => {
        if (
            isOpen &&
            container.current?.parentElement?.parentElement?.parentElement?.parentElement
                ?.parentElement?.scrollLeft === 0
        ) {
            setPosition('fixed');
        } else setPosition('absolute');
    }, [isOpen, container.current]);

    const items: ActionButton[] = [
        {
            type: 'link',
            label: 'View Details',
            icon: <Eye />,
            url: `${adminRoute}/collections/credential/${rowData.id}?fromBatchPage=true`,
        },
    ];

    if (simple && !readOnly) {
        items.push({
            type: 'button',
            label: 'Remove Earner',
            icon: <X />,
            onClick: async () => {
                const res = await fetch(`/api/credential/${rowData.id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (res.status === 200) onDelete?.();
            },
        });
    }

    if (!simple) {
        items.push({
            type: 'button',
            label: 'Resend',
            icon: <Send />,
            onClick: async () => {
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ credentialId: rowData.id }),
                });

                console.log(await response.json());
            },
        });

        items.push({
            type: 'button',
            label: isRevoked ? 'View Revocation Details' : 'Revoke',
            icon: <ArrowArcLeft />,
            onClick: () => openModal(revocationSlug),
        });

        items.push({
            type: 'link',
            label: 'View Batch',
            icon: <BarGraph />,
            url: `${adminRoute}/collections/credential-batch/${rowData.batch}`,
        });
    }

    const actionButtons = items.map(item => {
        if (item.type === 'button') {
            return (
                <button
                    key={item.label}
                    onClick={() => {
                        setIsOpen(false);
                        item.onClick();
                    }}
                    type="button"
                    className="action-button"
                >
                    {item.icon}
                    <span>{item.label}</span>
                </button>
            );
        }

        return (
            <Link to={item.url} key={item.label} className="action-button">
                {item.icon}
                <span>{item.label}</span>
            </Link>
        );
    });

    return (
        <section ref={container} className="actions-container">
            <section className={`actions ${isOpen ? 'open' : ''} ${position}`}>
                <button className="header-button" type="button" onClick={() => setIsOpen(!isOpen)}>
                    <span>Actions</span>
                    <Caret />
                </button>

                {actionButtons}
            </section>

            {isRevoked ? (
                <RevocationDetails
                    credential={rowData as any as Credential}
                    slug={revocationSlug}
                />
            ) : (
                <RevocationWarning
                    credential={rowData as any as Credential}
                    slug={revocationSlug}
                />
            )}
        </section>
    );
};

export default ActionsButton;
