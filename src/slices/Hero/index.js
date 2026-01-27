import React from 'react';
import clsx from 'clsx';
import { PrismicNextImage } from '@prismicio/next';
import { isFilled } from '@prismicio/helpers';
import { ConditionalLink } from '@/app/lib/ConditionalLink';
import { RichText } from '@/app/lib/RichText';
import styles from './hero.module.css';

export const Hero = ({ slice }) => {

	if (slice?.variation === 'default') {
		return (

			<div className={clsx(styles.default)}>

				{/* title */}
				{(isFilled.keyText(slice?.primary?.title) || isFilled.richText(slice?.primary?.content)) && (
					<div className={clsx(styles.top)}>
						<div className={clsx(styles.left)}>
							{isFilled.keyText(slice?.primary?.title) && (
								<h1 className={clsx(styles.h1)}>{slice?.primary?.title}</h1>
							)}

							{isFilled.richText(slice?.primary?.content) && (
								<div className={styles.copy}>
									<RichText field={slice?.primary?.content} />
								</div>
							)}
						</div>
					</div>
				)}

				{isFilled.image(slice?.primary?.image) && (!slice?.primary?.video?.url) && (
					<div className={clsx(styles.main)}>
						<PrismicNextImage field={slice?.primary?.image} className={clsx(styles.image)} />
					</div>
				)}

			</div>
		)
	}

};
