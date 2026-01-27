import React from 'react';
import { Settings } from '@/app/lib/settings';

const metadataBase = process.env.NEXT_PUBLIC_METADATA_BASE || 'https://stpiranstudio.com';

export function StructuredData({ type, data }) {
	if (!type || !data) return null;

	const getSchema = () => {
		switch (type) {
			case 'product':
				return getProductSchema(data);
			case 'article':
				return getArticleSchema(data);
			case 'organization':
				return getOrganizationSchema();
			case 'website':
				return getWebsiteSchema();
			case 'breadcrumb':
				return getBreadcrumbSchema(data);
			default:
				return null;
		}
	};

	const schema = getSchema();
	if (!schema) return null;

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	);
}

function getProductSchema({ product, category }) {
	if (!product?.data) return null;

	const price = product.data.price ?? product.data.category?.data?.price ?? 0;
	const availability = product.data.active ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
	const image = product.data.gallery?.[0]?.image?.url || product.data.meta_image?.url || Settings.meta.image;
	const url = category?.uid && product.uid 
		? `${metadataBase}/${category.uid}/${product.uid}`
		: `${metadataBase}`;

	return {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: product.data.title || product.data.meta_title,
		description: product.data.meta_description || product.data.description?.[0]?.text || '',
		image: image,
		url: url,
		sku: product.data.sku || product.uid,
		offers: {
			'@type': 'Offer',
			price: price.toFixed(2),
			priceCurrency: 'GBP',
			availability: availability,
			url: url,
		},
	};
}

function getArticleSchema({ post }) {
	if (!post?.data) return null;

	const url = `${metadataBase}${Settings.inspirationPrefix}/${post.uid}`;
	const image = post.data.meta_image?.url || post.data.image?.url || Settings.meta.image;
	const datePublished = post.data.date || post.first_publication_date;
	const dateModified = post.last_publication_date;

	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: post.data.title || post.data.meta_title,
		description: post.data.meta_description || post.data.excerpt?.[0]?.text || '',
		image: image,
		datePublished: datePublished,
		dateModified: dateModified,
		url: url,
		publisher: {
			'@type': 'Organization',
			name: Settings.meta.title,
			logo: {
				'@type': 'ImageObject',
				url: `${metadataBase}/logo.png`,
			},
		},
	};
}

function getOrganizationSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: Settings.meta.title,
		url: metadataBase,
		logo: `${metadataBase}/logo.png`,
		sameAs: [
			Settings.socials.facebook,
			Settings.socials.x,
			Settings.socials.instagram,
			Settings.socials.tiktok,
			Settings.socials.etsy,
		].filter(Boolean),
	};
}

function getWebsiteSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: Settings.meta.title,
		url: metadataBase,
		potentialAction: {
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: `${metadataBase}/search?q={search_term_string}`,
			},
			'query-input': 'required name=search_term_string',
		},
	};
}

function getBreadcrumbSchema({ items }) {
	if (!items || items.length === 0) return null;

	const breadcrumbList = items.map((item, index) => ({
		'@type': 'ListItem',
		position: index + 1,
		name: item.name,
		item: item.url,
	}));

	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: breadcrumbList,
	};
}
