import clsx from 'clsx';
import { isFilled } from '@prismicio/helpers';
import { PrismicRichText } from '@prismicio/react';
import { sliceStyle } from '@/app/lib/utils';
import sharedStyles from '@/app/shared.module.css';
import styles from './text.module.css';

export function Text({ slice }) {
	if (!slice) return null;

	const getAlignmentClass = () => {
		if (slice?.primary?.alignment === 'Right') return styles.alignRight;
		if (slice?.primary?.alignment === 'Center') return styles.alignCenter;
		return styles.alignLeft;
	};

	const getWidthClass = () => {
		if (slice?.variation === 'contentWidthText') return styles.contentWidth;
		if (slice?.variation === 'wideText') return styles.wideWidth;
		return styles.fullWidth;
	};

	// Default, contentWidthText, and wideText variations
	if (slice?.variation === 'default' || slice?.variation === 'contentWidthText' || slice?.variation === 'wideText') {
		return (
			<div className={clsx(styles.wrapper, sharedStyles.wrapper)} style={sliceStyle(slice?.primary)}>
				<div className={clsx(styles.content, sharedStyles.richText, getWidthClass(), getAlignmentClass())}>
					<PrismicRichText field={slice?.primary?.text} />
				</div>
			</div>
		);
	}

	// Quote variation
	if (slice?.variation === 'quote' && isFilled.richText(slice?.primary?.text)) {
		return (
			<div className={clsx(styles.wrapper, sharedStyles.wrapper)}>
				<div className={clsx(styles.quote, styles.content, sharedStyles.richText, getAlignmentClass())} style={sliceStyle(slice?.primary)}>
					<PrismicRichText field={slice?.primary?.text} />
				</div>
			</div>
		);
	}

	return null;
}
