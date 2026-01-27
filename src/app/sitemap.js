import { createClient } from '@/prismicio';
import { Settings } from '@/app/lib/settings';

const metadataBase = process.env.NEXT_PUBLIC_METADATA_BASE || 'https://stpiranstudio.com';

export default async function sitemap() {
	const client = createClient();
	const urls = [];

	try {
		// Homepage
		urls.push({
			url: metadataBase,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 1.0,
		});

		// Fetch all pages
		try {
			const pages = await client.getAllByType('page', {
				lang: '*',
			});

			pages.forEach((page) => {
				if (page.uid === 'homepage') return; // Already added

				urls.push({
					url: `${metadataBase}/${page.uid}`,
					lastModified: new Date(page.last_publication_date),
					changeFrequency: 'monthly',
					priority: page.uid === 'homepage' ? 1.0 : 0.8,
				});
			});
		} catch (error) {
			console.error('Error fetching pages for sitemap:', error);
		}

		// Fetch all product categories
		try {
			const categories = await client.getAllByType('product_category', {
				lang: '*',
			});

			categories.forEach((category) => {
				urls.push({
					url: `${metadataBase}/${category.data?.plural_url}`,
					lastModified: new Date(category.last_publication_date),
					changeFrequency: 'weekly',
					priority: 0.8,
				});
			});
		} catch (error) {
			console.error('Error fetching categories for sitemap:', error);
		}

		// Fetch all products
		try {
			const products = await client.getAllByType('product', {
				lang: '*',
				fetchLinks: ['product_category.uid'],
			});

			products.forEach((product) => {
				const categoryUid = product.data?.category?.data?.uid || product.data?.category?.uid;
				if (!categoryUid) return; // Skip products without category

				urls.push({
					url: `${metadataBase}/${categoryUid}/${product.uid}`,
					lastModified: new Date(product.last_publication_date),
					changeFrequency: 'monthly',
					priority: 0.7,
				});
			});
		} catch (error) {
			console.error('Error fetching products for sitemap:', error);
		}

		// Fetch all blog posts
		try {
			const posts = await client.getAllByType('post', {
				lang: '*',
			});

			posts.forEach((post) => {
				urls.push({
					url: `${metadataBase}${Settings.inspirationPrefix}/${post.uid}`,
					lastModified: new Date(post.last_publication_date),
					changeFrequency: 'monthly',
					priority: 0.6,
				});
			});
		} catch (error) {
			console.error('Error fetching posts for sitemap:', error);
		}

	} catch (error) {
		console.error('Error generating sitemap:', error);
	}

	return urls;
}
