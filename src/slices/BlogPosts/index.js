import { createClient } from '@/prismicio';
import clsx from 'clsx';
import Link from 'next/link';
import { isFilled } from '@prismicio/helpers';
import { PrismicNextImage } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';
import { sliceStyle } from '@/app/lib/utils';
import { Settings } from '@/app/lib/settings';
import sharedStyles from '@/app/shared.module.css';
import styles from './blogPosts.module.css';

const BlogPosts = async ({ slice }) => {
	const client = createClient();

	let posts = [];
	try {
		posts = await client.getAllByType('post', {
			orderings: [
				{
					field: 'my.post.date',
					direction: 'desc',
				},
			],
		});

		// Fallback: if date field is not available, sort by publication date
		if (posts.length > 0 && !posts[0].data.date) {
			posts.sort((a, b) => {
				const dateA = new Date(a.first_publication_date);
				const dateB = new Date(b.first_publication_date);
				return dateB - dateA;
			});
		}
	} catch (error) {
		console.error('Error fetching posts:', error);
	}

	if (posts.length === 0) {
		return null;
	}

	// If homepage is true, limit to last 3 posts
	const isHomepage = slice?.primary?.homepage === true;
	const displayPosts = isHomepage ? posts.slice(0, 3) : posts;

	return (
		<div className={clsx(styles.wrapper, sharedStyles.wrapper)} style={sliceStyle(slice?.primary)}>
			<div className={clsx(styles.postsGrid, isHomepage && styles.postsGridHomepage)}>
				{displayPosts.map((post) => {
					// Construct post URL using settings prefix
					const postUrl = post.url || `${Settings.inspirationPrefix}/${post.uid}`;

					return (
						<article key={post.id} className={styles.post}>
							<Link href={postUrl} className={styles.link}>
								{isFilled.image(post.data.image) && (
									<div className={styles.imageContainer}>
										<PrismicNextImage
											field={post.data.image}
											className={styles.image}
										/>
									</div>
								)}
								<div className={styles.content}>
									{isFilled.keyText(post.data.title) && (
										<h2 className={styles.title}>{post.data.title}</h2>
									)}
									{isFilled.date(post.data.date) && (
										<time className={styles.date} dateTime={post.data.date}>
											{new Date(post.data.date).toLocaleDateString('en-GB', {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											})}
										</time>
									)}
									{isFilled.richText(post.data.excerpt) && (
										<div className={styles.excerpt}>
											<PrismicRichText field={post.data.excerpt} />
										</div>
									)}
								</div>
							</Link>
						</article>
					);
				})}
			</div>
		</div>
	);
};

export default BlogPosts;
