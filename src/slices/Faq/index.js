"use client";

import React, { useState } from 'react';
import { PrismicRichText } from '@prismicio/react';
import { isFilled } from '@prismicio/helpers';
import clsx from 'clsx';
import { sliceStyle } from '@/app/lib/utils';
import sharedStyles from '@/app/shared.module.css';
import styles from './faq.module.css';

export const Faq = ({ slice }) => {
    const [openItem, setOpenItem] = useState(null);

    const toggleItem = (index) => {
        setOpenItem(openItem === index ? null : index);
    };

    const getAlignmentClass = () => {
        if (slice?.primary?.alignment === 'Right') return styles.contentRight;
        if (slice?.primary?.alignment === 'Center') return styles.contentCenter;
        return styles.contentLeft;
    };

    const backgroundSize = slice?.primary?.background_size === 'Cover' ? 'cover' : 'contain';

    const customStyles = {
        ...sliceStyle(slice?.primary),
        backgroundSize: isFilled.image(slice?.primary?.background_image) ? backgroundSize : undefined,
        backgroundImage: isFilled.image(slice?.primary?.background_image) ? `url(${slice?.primary?.background_image?.url})` : undefined,
    };

    return (
        <div 
            className={clsx(
                styles.wrapper,
                slice?.primary?.full_height && styles.wrapperFullHeight
            )}
            style={customStyles}
        >
            <div className={styles.innerWrapper}>
                {isFilled.richText(slice?.primary?.content) && (
                    <div className={clsx(styles.contentContainer, getAlignmentClass(), sharedStyles.richText)}>
                        <PrismicRichText field={slice?.primary?.content} />
                    </div>
                )}

                <div className={styles.accordionContainer}>
                    {slice?.items?.map((item, index) => (
                        <div key={index} className={styles.faqItem}>
                            <div className={clsx(
                                styles.faqItemContainer,
                                openItem === index && styles.faqItemContainerOpen
                            )}>
                                <button
                                    type="button"
                                    id={`faq-question-${index}`}
                                    className={styles.questionButton}
                                    onClick={() => toggleItem(index)}
                                    aria-expanded={openItem === index}
                                    aria-controls={`faq-answer-${index}`}
                                >
                                    <h4 className={styles.question}>{item?.question}</h4>
                                    <svg
                                        className={clsx(styles.chevron, openItem === index && styles.chevronOpen)}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {openItem === index && (
                                    <div 
                                        id={`faq-answer-${index}`}
                                        className={styles.answerContainer}
                                        role="region"
                                        aria-labelledby={`faq-question-${index}`}
                                    >
                                        <div className={clsx(styles.answerContent, sharedStyles.richText)}>
                                            <PrismicRichText field={item?.answer} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
