import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { PrismicNextLink } from '@prismicio/next';
import { isFilled } from '@prismicio/helpers';

export const ConditionalLink = ({ href, urlClassName, children }) => {
	// Check if href is a string first (before calling isFilled.link which uses 'in' operator)
	if (typeof href === 'string') {
		if (href.trim() !== '') {
			return (
				<Link href={href} className={clsx(urlClassName)}>
					{children}
				</Link>
			);
		} else {
			// Empty string, render as span
			return (
				<span className={clsx(urlClassName)}>
					{children}
				</span>
			);
		}
	}

	// Check if href is a valid Prismic link object (only if it's an object)
	if (href && typeof href === 'object' && isFilled.link(href)) {
    return (
                <PrismicNextLink field={href} className={clsx(urlClassName)}>
				{children}
                </PrismicNextLink>
		);
	}

	// Fallback to span if link is not valid
	return (
                <span className={clsx(urlClassName)}>
			{children}
                </span>
    );
};