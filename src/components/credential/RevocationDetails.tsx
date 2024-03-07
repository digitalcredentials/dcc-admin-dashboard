import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useModal } from '@faceless-ui/modal';
import { Drawer } from 'payload/dist/admin/components/elements/Drawer';

import './Revocation.scss';
import { Credential, User } from 'payload/generated-types';

export type RevocationDetailsProps = {
    credential: Credential;
    slug: string;
};

const RevocationDetails: React.FC<RevocationDetailsProps> = ({ slug, credential }) => {
    const [user, setUser] = useState<User | undefined>();
    const { modalState, closeModal } = useModal();

    useEffect(() => {
        if (modalState[slug]?.isOpen && credential.revokedBy) {
            fetch(`/api/users/${credential.revokedBy}`)
                .then(res => res.json())
                .then(setUser);
        }
    }, [slug, modalState[slug]?.isOpen]);

    return (
        <Drawer header={false} slug={slug} gutter={false}>
            <section className="revocation-details">
                <button type="button" aria-label="Close" onClick={() => closeModal(slug)} />

                <section>
                    <h2>Revocation Details</h2>

                    <section>
                        <span>Revoked by: {user?.name ?? user?.email ?? 'Unknown'}</span>
                        <span>
                            Revoked on:{' '}
                            {credential.revocationDate
                                ? format(new Date(credential.revocationDate), 'dd/MM/yyyy')
                                : 'Unknown'}
                        </span>
                        <span>Credential Name: {credential.credentialName}</span>
                        <span>Earner Name: {credential.earnerName}</span>
                    </section>

                    <label>
                        Revocation Explanation
                        <output>{credential.revocationReason}</output>
                    </label>

                    <button type="button" onClick={() => closeModal(slug)}>
                        Close
                    </button>
                </section>
            </section>
        </Drawer>
    );
};

export default RevocationDetails;
