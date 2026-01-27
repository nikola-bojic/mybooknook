import clsx from 'clsx';
import { isFilled } from '@prismicio/helpers';
import { Slices } from "@/app/lib/Slices";
import { ProductDetails } from "@/app/lib/ProductDetails";
import { BlogPostHeader } from "@/app/lib/BlogPostHeader";
import { BlogPostFooter } from "@/app/lib/BlogPostFooter";
import { StructuredData } from "@/app/lib/StructuredData";
import { Settings } from "../lib/settings";
import { getPageData } from "@/app/lib/utils";

export async function generateMetadata({ params }) {
	const pageData = await getPageData(params);
	const metadataBase = process.env.NEXT_PUBLIC_METADATA_BASE ? new URL(process.env.NEXT_PUBLIC_METADATA_BASE) : new URL('https://craftsupplieswarehouse.com');

	// Determine page type and build URL
	let canonicalUrl = metadataBase.toString();
	if (pageData?.post) {
		const url = new URL(`${Settings.inspirationPrefix}/${pageData.post.uid}`, metadataBase);
		canonicalUrl = url.toString();
	} else if (pageData?.product && pageData?.category) {
		// Use plural_url if available, otherwise use uid
		const categorySlug = pageData.category.data?.plural_url || pageData.category.uid;
		const url = new URL(`${categorySlug}/${pageData.product.uid}`, metadataBase);
		canonicalUrl = url.toString();
	} else if (pageData?.category && !pageData?.product) {
		// Use plural_url if available, otherwise use uid
		const categorySlug = pageData.category.data?.plural_url || pageData.category.uid;
		const url = new URL(categorySlug, metadataBase);
		canonicalUrl = url.toString();
	} else if (pageData?.page) {
		if (pageData.page.uid === 'homepage') {
			canonicalUrl = metadataBase.toString();
		} else {
			const url = new URL(pageData.page.uid, metadataBase);
			canonicalUrl = url.toString();
		}
	}

	// Get meta data
	const title = pageData?.post?.data?.meta_title
		? Settings.meta.title + ' - ' + pageData.post.data.meta_title
		: pageData?.product?.data?.meta_title
			? Settings.meta.title + ' - ' + pageData.product.data.meta_title
			: pageData?.category?.data?.meta_title
				? Settings.meta.title + ' - ' + pageData.category.data.meta_title
				: pageData?.page?.data?.meta_title
					? Settings.meta.title + ' - ' + pageData.page.data.meta_title
					: Settings.meta.title;

	const description = pageData?.post?.data?.meta_description
		? pageData.post.data.meta_description
		: pageData?.product?.data?.meta_description
			? pageData.product.data.meta_description
			: pageData?.category?.data?.meta_description
				? pageData.category.data.meta_description
				: pageData?.page?.data?.meta_description
					? pageData.page.data.meta_description
					: Settings.meta.description;

	const image = pageData?.post?.data?.meta_image?.url
		? pageData.post.data.meta_image.url
		: pageData?.product?.data?.meta_image?.url
			? pageData.product.data.meta_image.url
			: pageData?.category?.data?.meta_image?.url
				? pageData.category.data.meta_image.url
				: pageData?.page?.data?.meta_image?.url
					? pageData.page.data.meta_image.url
					: Settings.meta.image;

	// Determine Open Graph type
	let ogType = 'website';
	if (pageData?.post) {
		ogType = 'article';
	}

	return {
		metadataBase: metadataBase,
		title: title,
		description: description,
		alternates: {
			canonical: canonicalUrl,
		},
		openGraph: {
			title: title,
			description: description,
			url: canonicalUrl,
			siteName: Settings.meta.title,
			type: ogType,
			images: [
				{
					url: image,
					width: 1200,
					height: 630,
					alt: title,
				}
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: title,
			description: description,
			images: [image],
		},
	};
}

export default async function Page({ params }) {
	const pageData = await getPageData(params);

	return (
		<main
			className={clsx('main flex flex-col flex-grow min-h-full w-full pt-10')}
			style={{
				backgroundColor: pageData?.post?.data?.background_colour || pageData?.category?.data?.background_colour || pageData?.page?.data?.background_colour,
				backgroundImage: isFilled.image(pageData?.post?.data?.background_image) ? `url(${pageData?.post?.data?.background_image?.url})` : (isFilled.image(pageData?.category?.data?.background_image) ? `url(${pageData?.category?.data?.background_image?.url})` : (isFilled.image(pageData?.page?.data?.background_image) ? `url(${pageData?.page?.data?.background_image?.url})` : '')),
			}}>

			{/* Structured Data */}
			{pageData?.product && (
				<StructuredData
					type="product"
					data={{ product: pageData.product, category: pageData.category }}
				/>
			)}
			{pageData?.post && (
				<StructuredData
					type="article"
					data={{ post: pageData.post }}
				/>
			)}

			{/* Blog Post Header */}
			{pageData?.post && <BlogPostHeader post={pageData.post} />}

			{/* Blog Post Slices */}
			{pageData?.post && <Slices slices={pageData?.post?.data?.slices} />}

			{/* Blog Post Footer */}
			{pageData?.post && <BlogPostFooter currentPost={pageData.post} />}

			{/* Product Details */}
			{pageData?.product && <ProductDetails product={pageData?.product} category={pageData?.category} />}
			{pageData?.product && pageData?.product?.data?.slices && <Slices slices={pageData?.product?.data?.slices} />}

			{/* Product Category Slices - only show on category pages, not product pages */}
			{pageData?.category && !pageData?.product && !pageData?.post && pageData?.category?.data?.slices && pageData?.category?.data?.slices?.length > 0 && (
				<Slices slices={pageData?.category?.data?.slices} />
			)}

			{/* Regular Page Slices */}
			{!pageData?.post && !pageData?.product && !pageData?.category && <Slices slices={pageData?.page?.data?.slices} />}

		</main>

	);
}
