import { createRef, RefObject } from 'react';

/**
 * Glue code to help use HorizontalNavHeader and HorizontalNavFooter DSCs with useHorizontalPages
 *
 * Use like so:
 *
 * const refs = {
 *     page1: useRef<HTMLElement>(null),
 *     page2: useRef<HTMLElement>(null),
 *     page3: useRef<HTMLElement>(null),
 *     page4: useRef<HTMLElement>(null),
 * };
 *
 * const { on, scrollTo } = useHorizontalPages({ refs });
 *
 * const { currentPage, goForward, goBack, headerPages, footerPages } = getNavFunctions({
 *     on,
 *     scrollTo,
 *     pages: [
 *         { name: 'page1', canSkip: true, showMainButton: false },
 *         { name: 'page2', canSkip: true, showMainButton: false },
 *         { name: 'page3', canSkip: true, showMainButton: false },
 *         { name: 'page4', canSkip: false, showMainButton: true },
 *     ],
 * });
 *
 * return (
 *     <section>
 *         <HorizontalNavHeader currentPage={currentPage} pages={headerPages} skipPage={goForward} />
 *
 *         <section>
 *             <Page1 ref={refs.page1} />
 *             <Page2 ref={refs.page2} />
 *             <Page3 ref={refs.page3} />
 *             <Page4 ref={refs.page4} />
 *         </section>
 *
 *         <HorizontalNavFooter
 *             currentPage={currentPage}
 *             pages={footerPages}
 *             goBack={goBack}
 *             goForward={goForward}
 *         />
 *     </section>
 * );
 */
export const getNavFunctions = <
    On extends Record<string, boolean>,
    ScrollTo extends Record<keyof On, (smooth?: boolean, options?: ScrollIntoViewOptions) => void>,
    Pages extends Array<{ name: keyof On; canSkip: boolean; showMainButton: boolean }>
>({
    on,
    scrollTo,
    pages,
}: {
    on: On;
    scrollTo: ScrollTo;
    pages: Pages;
}) => {
    const currentPage = pages.findIndex(page => on[page.name]);
    const currentPageName = pages[currentPage]?.name;

    const goForward =
        currentPage < pages.length - 1 ? scrollTo[pages[currentPage + 1].name] : () => {};

    const goBack = currentPage > 0 ? scrollTo[pages[currentPage - 1].name] : () => {};

    const headerPages = pages.map((page, index) => page.canSkip && index !== pages.length - 1);

    const footerPages = pages.map(page => page.showMainButton);

    return {
        currentPage,
        currentPageName,
        goForward,
        goBack,
        headerPages,
        footerPages,
    };
};

/**
 * Helper to get a refs object expected by useHorizontalPages from an array of strings
 */
export const getNamedRefsFromArray = <Item extends string, Elements extends HTMLElement>(
    array: readonly Item[]
): Record<Item, RefObject<Elements>> => {
    return array.reduce<Record<Item, React.RefObject<Elements>>>(
        (acc, item) => ({ ...acc, [item]: createRef<Elements>() }),
        {} as Record<Item, React.RefObject<Elements>>
    );
};

/**
 * Helper to get a refs object expected by useHorizontalPages from an array of anything!
 */
export const getUnnamedRefsFromArray = <Elements extends HTMLElement>(
    array: unknown[]
): Record<string, RefObject<Elements>> => {
    return array.reduce<Record<string, React.RefObject<Elements>>>(
        (acc, _, index) => ({ ...acc, [index]: createRef<Elements>() }),
        {} as Record<string, React.RefObject<Elements>>
    );
};

export const getCarouselFunctions = <
    Item extends string,
    On extends Record<Item, boolean>,
    ScrollTo extends Record<keyof On, (smooth?: boolean, options?: ScrollIntoViewOptions) => void>
>({
    on,
    scrollTo,
}: {
    on: On;
    scrollTo: ScrollTo;
}): {
    current: keyof On;
    isFirst: boolean; // current index is at 0 -> start
    isLast: boolean; // current index is at -1 -> end
    scrollToNext: (smooth?: boolean, options?: ScrollIntoViewOptions) => void;
    scrollToPrevious: (smooth?: boolean, options?: ScrollIntoViewOptions) => void;
} => {
    const pages = Object.keys(on) as (keyof typeof on)[];

    const currentIndex = pages.findIndex(page => on[page]) ?? 0;

    const current = pages[currentIndex];

    const isFirst = currentIndex === 0;
    const isLast = currentIndex === pages.length - 1;

    const scrollToNext = (smooth?: boolean, options: ScrollIntoViewOptions = {}) => {
        scrollTo[pages[(currentIndex + 1) % pages.length]](smooth, options);
    };

    const scrollToPrevious = (smooth?: boolean, options: ScrollIntoViewOptions = {}) => {
        scrollTo[pages.at(currentIndex - 1) ?? pages[0]](smooth, options);
    };

    return { current, isFirst, isLast, scrollToNext, scrollToPrevious };
};

/** Generates a simple pages array with default names and everything set to false */
export const getSimplePages = <T extends string>(refs: Record<T, RefObject<Element>>) =>
    (Object.keys(refs) as T[]).map(name => ({
        name,
        canSkip: false,
        showMainButton: false,
    }));
