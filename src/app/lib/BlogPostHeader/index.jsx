import clsx from 'clsx';
import { isFilled } from '@prismicio/helpers';
import { PrismicNextImage } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';
import { sliceStyle } from '@/app/lib/utils';
import sharedStyles from '@/app/shared.module.css';
import styles from './blogPostHeader.module.css';

export function BlogPostHeader({ post }) {
	if (!post) return null;

	const postDate = post.data?.date;
	const postTypes = post.data?.types || [];
	const postImage = post.data?.image;
	const postTitle = post.data?.title;
	const postExcerpt = post.data?.excerpt;

	return (
		<header className={clsx(styles.wrapper)} style={sliceStyle(post.data)}>
			<div className={styles.container}>

				{/* Content */}
				<div className={styles.content}>

					{/* Title */}
					{isFilled.keyText(postTitle) && (
						<h1 className={styles.title}>{postTitle}</h1>
					)}

					{/* Date */}
					{isFilled.date(postDate) && (
						<time className={styles.date} dateTime={postDate}>
							{new Date(postDate).toLocaleDateString('en-GB', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</time>
					)}

					{/* Introduction/Excerpt */}
					{isFilled.richText(postExcerpt) && (
						<div className={styles.intro}>
							<PrismicRichText field={postExcerpt} />
						</div>
					)}

					{/* Types */}
					{postTypes.length > 0 && (
						<div className={styles.types}>
							{postTypes.map((typeItem, index) => (
								<span key={index} className={styles.type}>
									{typeItem.type}
								</span>
							))}
						</div>
					)}

				</div>
			</div>
		</header>
	);
}
