import clsx from 'clsx';
import { isFilled } from '@prismicio/helpers';
import { ConditionalLink } from '@/app/lib/ConditionalLink';
import { PrismicNextImage } from '@prismicio/next';
import { sliceStyle } from '@/app/lib/utils';
import sharedStyles from '@/app/shared.module.css';
import styles from './image.module.css';

export const Image = ({ slice }) => {
	if (!slice || !isFilled.image(slice?.primary?.image)) return null;

	const getWidthClass = () => {
		if (slice?.variation === 'contentWidthImage') return styles.contentWidth;
		if (slice?.variation === 'wideImage') return styles.wideWidth;
		if (slice?.variation === 'browserWidthImage') return styles.browserWidth;
		return styles.fullWidth;
	};

	return (
		<div className={clsx(styles.wrapper, sharedStyles.wrapper, getWidthClass())} style={sliceStyle(slice?.primary)}>
			<ConditionalLink href={isFilled.link(slice?.primary?.url) ? slice?.primary?.url : null} urlClassName={styles.imageLink}>
				<PrismicNextImage
					field={slice?.primary?.image}
					className={clsx(styles.image)}
				/>
			</ConditionalLink>
		</div>
	);
};
