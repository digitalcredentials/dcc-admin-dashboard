import React, { useState, useEffect } from 'react';
import { useModal } from '@faceless-ui/modal';
import { Drawer } from 'payload/dist/admin/components/elements/Drawer';

import ArrowArcLeft from '../svgs/ArrowArcLeft';

import './Revocation.scss';
import { Credential } from 'payload/generated-types';
import { CREDENTIAL_STATUS } from '../../constants/credentials';

export type RevocationWarningProps = {
    credential: Credential;
    slug: string;
};

const RevocationWarning: React.FC<RevocationWarningProps> = ({ slug, credential }) => {
    const [reason, setReason] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [batchName, setBatchName] = useState('');
    const { modalState, closeModal } = useModal();

    const isNotSentYet = credential.status === CREDENTIAL_STATUS.DRAFT;

    const revokeCredential = async () => {
        await fetch(`/api/revoke-credential/${credential.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason }),
        });

        closeModal(slug);
    };

    useEffect(() => {
        if (modalState[slug]?.isOpen) {
            fetch(`/api/credential-batch/${credential.batch}`)
                .then(res => res.json())
                .then(batch => {
                    setBatchName(batch.title);
                });
        }
    }, [slug, modalState[slug]?.isOpen]);

    return (
        <Drawer header={false} slug={slug} gutter={false}>
            <section className="revocation-warning">
                <button type="button" aria-label="Close" onClick={() => closeModal(slug)} />

                <form
                    onSubmit={e => {
                        e.preventDefault();
                        revokeCredential();
                    }}
                >
                    <header role="presentation">
                        <ArrowArcLeft />
                    </header>
                    <h2>{isNotSentYet ? 'Cancel' : 'Revoke'} Credential?</h2>
                    <p>
                        By {isNotSentYet ? 'cancelling' : 'revoking'} this credential, you
                        acknowledge the immediate invalidation and withdrawal of the issued
                        credential.
                    </p>
                    <section>
                        <span>Credential Name: {credential.credentialName}</span>
                        <span>Template Name: {batchName}</span>
                        <span>Earner Name: {credential.earnerName}</span>
                    </section>
                    <label>
                        Add a comment explaining why you're{' '}
                        {isNotSentYet ? 'cancelling' : 'revoking'} this credential.
                        <textarea
                            onChange={e => setReason(e.target.value)}
                            value={reason}
                            autoFocus
                        />
                    </label>
                    <label>
                        Type the name of the credential you're{' '}
                        {isNotSentYet ? 'cancelling' : 'revoking'}.
                        <input
                            type="text"
                            onChange={e => setConfirmation(e.target.value)}
                            value={confirmation}
                        />
                    </label>
                    <button disabled={confirmation !== credential.credentialName}>Revoke</button>
                </form>
            </section>
        </Drawer>
    );
};

export default RevocationWarning;
