import { createClient } from '@/prismicio';
import clsx from 'clsx';
import Link from 'next/link';
import { isFilled } from '@prismicio/helpers';
import { PrismicNextImage } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';
import { Settings } from '@/app/lib/settings';
import sharedStyles from '@/app/shared.module.css';
import styles from './blogPostFooter.module.css';

export async function BlogPostFooter({ currentPost }) {
	if (!currentPost) return null;

	const client = createClient();
	
	let allPosts = [];
	try {
		allPosts = await client.getAllByType('post', {
			orderings: [
				{
					field: 'my.post.date',
					direction: 'desc',
				},
			],
		});
	} catch (error) {
		console.error('Error fetching posts for footer:', error);
	}

	// Find current post index
	// Posts are ordered by date DESC (newest first), so:
	// - Previous = older post (published before) = index + 1
	// - Next = newer post (published after) = index - 1
	const currentIndex = allPosts.findIndex(post => post.id === currentPost.id);
	
	// Get previous (older) and next (newer) posts
	const previousPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
	const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

	if (!previousPost && !nextPost) {
		return null;
	}

	const getPostUrl = (post) => {
		return post.url || `${Settings.inspirationPrefix}/${post.uid}`;
	};

	return (
		<footer className={clsx(styles.wrapper, sharedStyles.wrapper)}>
			<div className={clsx(styles.container, !previousPost && nextPost && styles.containerRightOnly)}>
				{/* Previous Post */}
				{previousPost && (
					<Link href={getPostUrl(previousPost)} className={clsx(styles.postLink, styles.previousPost)}>
						<div className={styles.imageColumn}>
							{isFilled.image(previousPost.data?.image) && (
								<PrismicNextImage
									field={previousPost.data.image}
									className={styles.image}
								/>
							)}
						</div>
						<div className={styles.contentColumn}>
							<div className={styles.label}>Previous</div>
							{isFilled.keyText(previousPost.data?.title) && (
								<h3 className={styles.title}>{previousPost.data.title}</h3>
							)}
							{isFilled.richText(previousPost.data?.excerpt) && (
								<div className={styles.intro}>
									<PrismicRichText field={previousPost.data.excerpt} />
								</div>
							)}
						</div>
					</Link>
				)}

				{/* Next Post */}
				{nextPost && (
					<Link href={getPostUrl(nextPost)} className={clsx(styles.postLink, styles.nextPost)}>
						<div className={styles.imageColumn}>
							{isFilled.image(nextPost.data?.image) && (
								<PrismicNextImage
									field={nextPost.data.image}
									className={styles.image}
								/>
							)}
						</div>
						<div className={styles.contentColumn}>
							<div className={styles.label}>Next</div>
							{isFilled.keyText(nextPost.data?.title) && (
								<h3 className={styles.title}>{nextPost.data.title}</h3>
							)}
							{isFilled.richText(nextPost.data?.excerpt) && (
								<div className={styles.intro}>
									<PrismicRichText field={nextPost.data.excerpt} />
								</div>
							)}
						</div>
					</Link>
				)}
			</div>
		</footer>
	);
}
