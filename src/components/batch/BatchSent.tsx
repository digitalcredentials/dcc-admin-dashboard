import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useModal } from '@faceless-ui/modal';
import { Drawer } from 'payload/dist/admin/components/elements/Drawer';

import { useField } from 'payload/components/forms';
import Check from '../svgs/Check';

export type BatchSentProps = {
    slug: string;
};

const BatchSent: React.FC<BatchSentProps> = ({ slug }) => {
    const history = useHistory();
    const { closeModal } = useModal();

    const title = useField<string>({ path: 'title' });

    return (
        <Drawer header={false} slug={slug} gutter={false}>
            <section className="relative w-full h-full flex items-center justify-center">
                <button
                    type="button"
                    aria-label="Close"
                    className="absolute h-full w-full opacity-0"
                    onClick={() => {
                        closeModal(slug);
                        history.push('/admin/collections/credential-batch');
                    }}
                />

                <section className="relative bg-[--theme-bg] rounded-2xl p-10 flex flex-col gap-5 items-center w-full max-w-xl">
                    <header className="rounded-full bg-green-500 flex p-5" role="presentation">
                        <Check className="w-10 h-10 text-white" />
                    </header>

                    <h2 className="text-center font-inter text-3xl font-semibold">
                        {title.value} is being sent!
                    </h2>

                    <p className="text-center font-inter text-xl font-normal">
                        Your batch is now being queued for processing and emails are being sent out
                        to earners for them to claim their credentials. Please note that no further
                        changes can be made to this batch.
                    </p>

                    <Link
                        className="mt-5 bg-green-500 text-white flex items-center justify-center px-4 py-2 w-full rounded-xl font-inter text-xl font-semibold"
                        to="/admin/collections/credential-batch"
                        onClick={() => closeModal(slug)}
                    >
                        Got it!
                    </Link>
                </section>
            </section>
        </Drawer>
    );
};

export default BatchSent;
