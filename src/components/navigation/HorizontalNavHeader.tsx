import React from 'react';
import { useTranslation } from 'react-i18next';
import { Flipped, Flipper } from 'react-flip-toolkit';

import './navigation.scss';

type HorizontalNavHeaderProps = {
    currentPage: number;
    pages: boolean[];
    skipPage?: () => void;
    className?: string;
    tag?: keyof JSX.IntrinsicElements;
    showCurrentPage?: boolean;
};

const HorizontalNavHeader: React.FC<HorizontalNavHeaderProps> = ({
    currentPage,
    pages,
    skipPage,
    className = '',
    tag: Tag = 'header',
    showCurrentPage = false,
}) => {
    const { t } = useTranslation();

    const dots = pages.map((_, index) => (
        <Flipped flipId={currentPage === index ? 'active' : index} key={index}>
            <div role="presentation" className={currentPage === index ? 'active' : ''} />
        </Flipped>
    ));

    return (
        <Tag className={`horizontal-nav-header ${className}`}>
            <Flipper element="nav" flipKey={currentPage}>
                {dots}
            </Flipper>

            {pages[currentPage] && (
                <button type="button" onClick={() => skipPage?.()}>
                    {t('common:global.verbs.skip')}
                </button>
            )}

            {showCurrentPage && <span>{`${currentPage + 1} of ${pages.length}`}</span>}
        </Tag>
    );
};

export default HorizontalNavHeader;
