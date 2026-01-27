import clsx from 'clsx';
import { isFilled } from '@prismicio/helpers';
import { PrismicRichText } from '@prismicio/react';
import { sliceStyle } from '@/app/lib/utils';
import sharedStyles from '@/app/shared.module.css';
import styles from './video.module.css';

export const Video = ({ slice }) => {
	// Check if either video_file (Prismic media) or video_embed (YouTube/Vimeo) is filled
	// LinkToMedia fields can be checked with isFilled.linkToMedia or isFilled.link
	const hasVideoFile = isFilled.linkToMedia(slice?.primary?.video_file) ||
		(isFilled.link(slice?.primary?.video_file) && slice?.primary?.video_file?.link_type === 'Media');
	const hasVideoEmbed = isFilled.embed(slice?.primary?.video_embed);

	if (!slice || (!hasVideoFile && !hasVideoEmbed)) return null;

	const getWidthClass = () => {
		if (slice?.variation === 'contentWidthVideo') return styles.contentWidth;
		if (slice?.variation === 'wideVideo') return styles.wideWidth;
		if (slice?.variation === 'browserWidthVideo') return styles.browserWidth;
		return styles.fullWidth;
	};

	// Get video URL from Prismic media library
	const videoUrl = slice?.primary?.video_file?.url;
	const hasText = isFilled.richText(slice?.primary?.text);

	return (
		<div className={styles.outerWrapper} style={sliceStyle(slice?.primary)}>
			<div className={clsx(styles.wrapper, sharedStyles.wrapper, getWidthClass())}>
				{hasText && (
					<div className={clsx(styles.textContent, sharedStyles.richText)}>
						<PrismicRichText field={slice?.primary?.text} />
					</div>
				)}
				<div className={styles.videoContainer}>
					{/* Prioritize Prismic media library video over embed */}
					{hasVideoFile && videoUrl && (
						<video
							className={styles.video}
							controls
							src={videoUrl}
							style={{ width: '100%', height: '100%' }}
						>
							Your browser does not support the video tag.
						</video>
					)}
					{/* Fall back to embed if no media library video */}
					{!hasVideoFile && hasVideoEmbed && (
						<div
							className={styles.embedWrapper}
							dangerouslySetInnerHTML={{ __html: slice?.primary?.video_embed?.html || '' }}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
