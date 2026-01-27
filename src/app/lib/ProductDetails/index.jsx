"use client";

import React, { useState } from 'react';
import clsx from 'clsx';
import { PrismicRichText } from '@prismicio/react';
import { Carousel } from '@/app/lib/Carousel';
import { Slices } from '@/app/lib/Slices';
import { VariationAndBasketButton } from '@/app/lib/VariationAndBasketButton';
import sharedStyles from '@/app/shared.module.css';
import styles from './productDetails.module.css';

export function ProductDetails({ product, category }) {
	const [currentPrice, setCurrentPrice] = useState(
		product?.data?.price ?? product?.data?.category?.data?.price ?? 0
	);

	const handlePriceChange = (newPrice) => {
		if (newPrice != null) {
			setCurrentPrice(newPrice);
		}
	};

	return (
		<div className={styles.wrapper}>
			<div className={styles.container}>

				{/* carousel */}
				<div className={styles.carousel}>
					<Carousel gallery={product?.data?.gallery} />
				</div>

				{/* description */}
				<div className={styles.description}>
					<div className={styles.descriptionInner}>
						<div className={styles.titleRow}>
							<h1 className={styles.title}>{product?.data?.title}</h1>
						</div>

						<div className={styles.priceRow}>
							<h6 className={styles.price}>£{currentPrice.toFixed(2)}</h6>
						</div>

						<div className={clsx(styles.descriptionText, sharedStyles.richText)}>
							<PrismicRichText field={product?.data?.description} />
						</div>
					</div>

					{/* variations and button - aligned to bottom */}
					<div className={styles.actionsWrapper}>
						{product?.data?.active ? (
							<VariationAndBasketButton
								product={product?.data}
								uid={product?.uid}
								onPriceChange={handlePriceChange}
							/>
						) : (
							<p className={styles.soldOut}>Sold out</p>
						)}
					</div>
				</div>

			</div>

			{category?.data?.slices && (
				<div className={styles.slicesWrapper}>
					<Slices slices={category.data.slices} />
				</div>
			)}
		</div>
	);
}
