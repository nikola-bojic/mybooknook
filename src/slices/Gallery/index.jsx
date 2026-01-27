"use client";

import { useState, useMemo } from 'react';
import clsx from 'clsx';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextLink, PrismicNextImage } from '@prismicio/next'
import { isFilled } from '@prismicio/helpers';
import { ConditionalLink } from '@/app/lib/ConditionalLink'
import { sliceStyle } from '@/app/lib/utils';
import sharedStyles from '@/app/shared.module.css';
import styles from './slice.module.css';

export const Gallery = ({ slice }) => {
	const [sortBy, setSortBy] = useState('recommendation');
	const isProductListing = slice?.primary?.product_listing === true;

	const getColumnsClass = () => {
		if (slice?.primary?.columns == 1) return styles.columns1;
		if (slice?.primary?.columns == 2) return styles.columns2;
		if (slice?.primary?.columns == 3) return styles.columns3;
		return styles.columns4;
	};

	const getAlignmentClass = () => {
		if (slice?.primary?.alignment === 'Right') return styles.contentContainerRight;
		if (slice?.primary?.alignment === 'Center') return styles.contentContainerCenter;
		return styles.contentContainerLeft;
	};

	// Filter and sort items when product_listing is enabled
	const processedItems = useMemo(() => {
		let items = slice?.items || [];

		// Filter to only items with products when product_listing is enabled
		if (isProductListing) {
			items = items.filter((item) => {
				const product = item?.product?.link_type === 'Document' && item?.product?.data ? item?.product : null;
				const hasProductLink = item?.link && typeof item.link === 'object' && 'data' in item.link;
				return product || hasProductLink;
			});
		}

		// Sort items based on selected sort option
		if (isProductListing && sortBy !== 'recommendation') {
			items = [...items].sort((a, b) => {
				const getPrice = (item) => {
					const product = item?.product?.link_type === 'Document' && item?.product?.data ? item?.product : null;
					if (product) {
						return product?.data?.price ?? product?.data?.category?.data?.price ?? 0;
					}
					if (item?.link && typeof item.link === 'object' && 'data' in item.link) {
						return item?.link?.data?.price ?? item?.link?.data?.category?.data?.price ?? 0;
					}
					return 0;
				};

				const priceA = getPrice(a);
				const priceB = getPrice(b);

				if (sortBy === 'price-low-high') {
					return priceA - priceB;
				} else if (sortBy === 'price-high-low') {
					return priceB - priceA;
				}
				return 0;
			});
		}

		return items;
	}, [slice?.items, isProductListing, sortBy]);

	const productCount = processedItems.length;

	return (
		<div className={clsx(styles.wrapper, sharedStyles.wrapper)} style={sliceStyle(slice?.primary)}>

			<div className={clsx(styles.contentContainer, sharedStyles.richText, getAlignmentClass())}>
				<PrismicRichText field={slice?.primary?.content} />
			</div>

			{isProductListing && (
				<div className={styles.productListingHeader}>
					<div className={styles.productCount}>
						{productCount} {productCount === 1 ? 'product' : 'products'}
					</div>
					<div className={styles.sortContainer}>
						<select
							className={styles.sortSelect}
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							aria-label="Sort products"
						>
							<option value="recommendation">Sort by recommendation</option>
							<option value="price-low-high">Sort by price (Low &gt; High)</option>
							<option value="price-high-low">Sort by price (High &gt; Low)</option>
						</select>
					</div>
				</div>
			)}

			<div className={clsx(
				styles.galleryContainer,
				slice?.primary?.columns == 1 && styles.columns1,
				slice?.primary?.columns == 2 && styles.columns2,
				slice?.primary?.columns == 3 && styles.columns3,
				slice?.primary?.columns == 4 && styles.columns4
			)}>
				{processedItems.map((item, index) => {
					// Check if product is linked (even without data, we can use the link)
					const hasProductLink = item?.product?.link_type === 'Document';
					const product = hasProductLink ? item?.product : null;

					// When using fetchLinks, Prismic may structure data differently
					// Check if data exists, otherwise check if fields are directly on the product object
					const productData = product?.data;
					const productTitle = productData?.title || product?.title;
					const productPrice = productData?.price ?? productData?.category?.data?.price ?? productData?.category?.price ?? product?.price ?? product?.category?.data?.price ?? product?.category?.price;
					const productActive = productData?.active !== undefined ? productData?.active : product?.active;
					const productGallery = productData?.gallery || product?.gallery;

					// Check if link is a document link with data (could be a product document)
					const hasLinkData = item?.link && typeof item.link === 'object' && 'data' in item.link && item?.link?.link_type === 'Document';
					const linkProduct = hasLinkData ? item.link : null;
					const linkProductData = linkProduct?.data;
					const linkProductTitle = linkProductData?.title || linkProduct?.title;
					const linkProductPrice = linkProductData?.price ?? linkProductData?.category?.data?.price ?? linkProductData?.category?.price ?? linkProduct?.price ?? linkProduct?.category?.data?.price ?? linkProduct?.category?.price;
					const linkProductActive = linkProductData?.active !== undefined ? linkProductData?.active : linkProduct?.active;
					const linkProductGallery = linkProductData?.gallery || linkProduct?.gallery;

					// Get titles - prioritize item title, then product title, then link product title
					const title = isFilled.keyText(item?.title) ? item?.title : null;
					const caption = isFilled.keyText(item?.caption) ? item?.caption : null;

					// Determine valid href for ConditionalLink
					const getValidHref = (url) => {
						if (!url) return null;
						if (typeof url === 'string' && url.trim() !== '') return url;
						if (typeof url === 'object' && isFilled.link(url)) return url;
						return null;
					};

					// Determine which image to use: item image, or product's first gallery image if product is linked
					let imageToUse = item?.image;
					if (!isFilled.image(item?.image) && productGallery && isFilled.image(productGallery?.[0]?.image)) {
						imageToUse = productGallery[0].image;
					}
					// Also check link product's gallery
					if (!isFilled.image(imageToUse) && linkProductGallery && isFilled.image(linkProductGallery?.[0]?.image)) {
						imageToUse = linkProductGallery[0].image;
					}

					if (isFilled.image(imageToUse)) {
						// Use product data if available, otherwise fall back to link product data
						const displayTitle = title || productTitle || linkProductTitle;
						const displayPrice = productPrice ?? linkProductPrice;
						const isSoldOut = productActive === false || linkProductActive === false;

						// Determine the href - prioritize product link object, then link object, then URLs
						const href = product || linkProduct || (typeof item?.link === 'string' ? item?.link : item?.link);

						return (
							<ConditionalLink
								urlClassName={clsx(styles.link, getColumnsClass())}
								href={getValidHref(href)}
								key={index}>
								<PrismicNextImage className={styles.image} field={imageToUse} />
								<div className={styles.content}>
									{displayTitle && (
										<div className={styles.titleRow}>
											<h2 className={styles.title}>{displayTitle}</h2>
										</div>
									)}
									{(displayPrice !== undefined && displayPrice !== null) && <p className={styles.price}>£{displayPrice.toFixed(2)}</p>}
									{caption && <p className={styles.caption}>{caption}</p>}
									{isSoldOut && (<p className={styles.soldOut}>Sold out</p>)}
								</div>
							</ConditionalLink>
						)
					} else if (item?.link && typeof item.link === 'object' && 'data' in item.link && isFilled.image(linkProductGallery?.[0]?.image)) {
						const linkTitle = title || linkProductTitle;
						const linkPrice = linkProductPrice;
						const linkHref = linkProduct?.url || item?.link;

						return (
							<ConditionalLink
								urlClassName={clsx(styles.link, styles.linkCenter, getColumnsClass())}
								href={getValidHref(linkHref)}
								key={index}>
								<PrismicNextImage className={styles.image} field={linkProductGallery[0].image} />
								<div className={styles.content}>
									{linkTitle && (
										<div className={styles.titleRow}>
											<h2 className={styles.title}>{linkTitle}</h2>
										</div>
									)}
									{linkPrice !== undefined && linkPrice !== null && <p className={styles.price}>£{linkPrice.toFixed(2)}</p>}
									{caption && <p className={styles.caption}>{caption}</p>}
									{linkProductActive === false && (<p className={styles.soldOut}>Sold out</p>)}
								</div>
							</ConditionalLink>
						)
					}
				})}
			</div>
		</div>
	);
};
