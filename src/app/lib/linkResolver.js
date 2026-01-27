import { Settings } from '@/app/lib/settings';
import { isFilled } from '@prismicio/helpers';

export const linkResolver = (document) => {
	if (!document) return '/';

	if (document.isBroken) {
		return `/`;
	}

	if (document.uid === 'homepage') return '/';

	// Product Categories - check plural_url BEFORE using document.url
	// This ensures we use plural_url even if Prismic resolved a URL with uid
	if (document.type === 'product_category') {
		// Use plural_url if available, otherwise use uid
		// Check if plural_url field is filled (using isFilled for Text fields)
		const pluralUrl = isFilled.keyText(document.data?.plural_url)
			? document.data.plural_url
			: (isFilled.keyText(document.plural_url) ? document.plural_url : null);
		if (pluralUrl) {
			return `/${pluralUrl}`;
		}
		// Fall back to document.url if no plural_url, otherwise use uid
		if (document.url) return document.url;
		return `/${document.uid}`;
	}

	// If Prismic already resolved a URL (via `routes`), use it
	// (but only if not a product_category, which we handled above)
	if (document.url) return document.url;

	// Pages
	if (document.type === 'page') {
		return `/${document.uid}`;
	}

	// Posts
	if (document.type === 'post') {
		return `${Settings.inspirationPrefix}/${document.uid}`;
	}

	// Products - Prismic routes should handle this via document.url, but we can add explicit handling
	// The routes config in prismicio.js should already resolve this, but this is a fallback
	if (document.type === 'product') {

		// If Prismic already resolved the URL via routes, use it
		// Otherwise, try to build it from category and uid
		if (document.url) {
			return document.url;
		}

		// Fallback: try to get category from document data
		if (document.data?.category?.uid) {
			const categorySlug = document.data?.category?.data?.plural_url || document.data?.category?.uid;
			return `/${categorySlug}/${document.uid}`;
		}

		// If no category, just use uid (shouldn't happen, but fallback)
		return `/${document.uid}`;
	}

	// Default
	return '/';
};