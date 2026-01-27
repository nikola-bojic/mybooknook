"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import clsx from 'clsx';
import Link from 'next/link';
import { PrismicNextLink } from '@prismicio/next';
import { toast } from 'react-toastify';
import { useBasket } from '@/app/context/BasketContext';
import { triggerConfettiFromElement } from '@/app/lib/confetti';
import { Settings } from '@/app/lib/settings';
import { isFilled } from '@prismicio/helpers';
import styles from './variations.module.css';

const groupVariationsByLabel = (variations) => {
	const groupedVariations = {};

	variations.forEach(({ label, description, variation, price }) => {
		if (!groupedVariations[label]) {
			groupedVariations[label] = {
				label,
				description,
				items: []
			};
		}

		groupedVariations[label].items.push({
			value: variation,
			price: price
		});
	});

	return groupedVariations;
};

export const VariationAndBasketButton = ({ product, uid, onPriceChange }) => {
	const { basket, setBasket } = useBasket();
	const groupedVariations = groupVariationsByLabel(product?.variations || []);

	// Initialize selected variations
	const getInitialVariations = () => {
		const initial = {};
		Object.keys(groupedVariations).forEach((label) => {
			if (label === 'Name' && groupedVariations[label]?.items?.[0]?.value) {
				initial[label] = groupedVariations[label].items[0].value;
			} else {
				initial[label] = '';
			}
		});
		return initial;
	};

	const [selectedVariations, setSelectedVariations] = useState(getInitialVariations);
	const [quantity, setQuantity] = useState(1);
	const [error, setError] = useState(null);
	const [isDisabled, setIsDisabled] = useState(false);

	// Function to find the current variation price
	// This looks for a variation entry that matches the selected variation value for any label
	const getCurrentVariationPrice = () => {
		if (!product?.variations || product.variations.length === 0) {
			return null;
		}

		// Find the first variation entry that matches any selected variation value and has a price
		// We check all selected variations to find one with a price override
		for (const [label, selectedValue] of Object.entries(selectedVariations)) {
			if (!selectedValue) continue;

			// Find variation entry that matches this label and value
			const matchingVariation = product.variations.find((variation) => {
				return variation.label === label &&
					variation.variation === selectedValue &&
					variation.price != null;
			});

			if (matchingVariation) {
				return matchingVariation.price;
			}
		}

		return null;
	};

	useEffect(() => {
		// Retrieve the existing product from the basket
		const existingProduct = basket?.products?.find(
			(item) => item.sku === product.sku
		);

		// If the product is in the basket, set the initial selected variations and quantity
		if (existingProduct) {
			setSelectedVariations(existingProduct.selectedVariation || {});
			setQuantity(existingProduct.quantity || 1);
			setIsDisabled(true);
		} else {
			setIsDisabled(false);
		}

	}, [basket]);

	useEffect(() => {
		// Check if the product is already in the basket
		const existingProduct = basket?.products?.find(
			(item) =>
				item.sku === product.sku &&
				JSON.stringify(item.selectedVariation || {}) ===
				JSON.stringify(selectedVariations || {})
		);

		// If the product is in the basket, set the initial selected variations and quantity
		if (existingProduct) {
			setSelectedVariations(existingProduct.selectedVariation || {});
			setQuantity(existingProduct.quantity);
			setIsDisabled(true);
		} else {
			setIsDisabled(false);
		}
	}, [basket, product, selectedVariations]);

	const handleVariationChange = (label, variation) => {
		setError(null);

		setSelectedVariations((prev) => {
			const newSelections = {
				...prev,
				[label]: variation,
			};

			// Notify parent of price change
			if (onPriceChange) {
				const variationPrice = getVariationPriceForSelection(newSelections);
				const finalPrice = variationPrice ?? product?.price ?? product?.category?.data?.price;
				onPriceChange(finalPrice);
			}

			return newSelections;
		});

		setIsDisabled(false);
	};

	// Helper function to get price for a given selection
	const getVariationPriceForSelection = (selections) => {
		if (!product?.variations || product.variations.length === 0) {
			return null;
		}

		// Find the first variation entry that matches any selected variation value and has a price
		for (const [label, selectedValue] of Object.entries(selections)) {
			if (!selectedValue) continue;

			const matchingVariation = product.variations.find((variation) => {
				return variation.label === label &&
					variation.variation === selectedValue &&
					variation.price != null;
			});

			if (matchingVariation) {
				return matchingVariation.price;
			}
		}

		return null;
	};

	// Update price when selectedVariations change
	useEffect(() => {
		if (onPriceChange) {
			const variationPrice = getCurrentVariationPrice();
			const finalPrice = variationPrice ?? product?.price ?? product?.category?.data?.price;
			onPriceChange(finalPrice);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedVariations]);

	const handleQuantityChange = (newQuantity) => {
		setQuantity(newQuantity);
		setIsDisabled(false);
	};

	const addToBasket = (buttonEl) => {
		setError(null);

		if (isDisabled) {
			return;
		}

		// Validate that all variations are selected if there are variations
		if (Object.keys(groupedVariations).length > 0) {
			for (const label in groupedVariations) {
				if (!selectedVariations[label]) {
					setError(`Please select a ${label.toLowerCase()}`);
					return;
				}
			}
		}

		let existingBasket = Cookies.get(Settings.cookieName);
		existingBasket = existingBasket ? JSON.parse(existingBasket) : {};

		// Initialize the `products` array if it doesn't exist
		if (!existingBasket.products) {
			existingBasket.products = [];
		}

		// Check if the current product with the same variations and quantity is already in the basket
		const existingProductIndex = existingBasket.products?.findIndex(
			(item) =>
				item.sku === product.sku &&
				JSON.stringify(item.selectedVariation || {}) ===
				JSON.stringify(selectedVariations || {})
		);

		// check if this is one off item and the quantity cannot be updated, just altered the variation
		const oneOffProductAlreadyInBasket = existingBasket.products?.findIndex(
			(item) =>
				item.sku === product.sku &&
				product.moq === "1"
		);

		// If the product is already in the basket, update the quantity
		if (existingProductIndex !== -1) {
			existingBasket.products[existingProductIndex].quantity = quantity;
			toast.info(`Quantity updated`);
			if (buttonEl) triggerConfettiFromElement(buttonEl);

			// or update the variation
		} else if (oneOffProductAlreadyInBasket !== -1) {
			existingBasket.products[oneOffProductAlreadyInBasket].selectedVariation = selectedVariations;
			toast.info(`Product updated`);
			if (buttonEl) triggerConfettiFromElement(buttonEl);

		} else {

			// Get the price for the selected variation
			const variationPrice = getCurrentVariationPrice();
			const finalPrice = variationPrice ?? product?.price ?? product?.category?.data?.price;

			// Add the new product if it is not in the basket
			const newProduct = {
				title: product?.title,
				image: product?.gallery?.[0]?.image,
				url: `/${product?.category?.uid}/${uid}`,
				quantity: quantity,
				selectedVariation: selectedVariations,
				sku: product?.sku,
				moq: product?.moq,
				price: finalPrice,
				postage_price_uk: product?.category?.data?.postage_price_uk,
				postage_price_eu: product?.category?.data?.postage_price_eu,
				postage_price_na: product?.category?.data?.postage_price_na,
				postage_price_sa: product?.category?.data?.postage_price_sa,
				postage_price_af: product?.category?.data?.postage_price_af,
				postage_price_as: product?.category?.data?.postage_price_as,
				postage_price_oc: product?.category?.data?.postage_price_oc,
				postage_price_other: product?.category?.data?.postage_price_other
			};

			existingBasket.products.push(newProduct);
			toast.success(`Added to your basket`);
			if (buttonEl) triggerConfettiFromElement(buttonEl);
		}

		// Update the basket and save it to the cookie
		Cookies.set(Settings.cookieName, JSON.stringify(existingBasket), { expires: 7 });

		// Update the basket state
		setBasket(existingBasket);
	};

	return (
		<div className={styles.container}>
			{Object.values(groupedVariations).map((group) => (
				<div className={styles.variationGroup} key={group.label}>
					<p className={styles.variationLabel}>{group.description}</p>
					<div className={styles.variationsContainer}>
						{group.items.map((variationItem, index) => {
							const variation = typeof variationItem === 'string' ? variationItem : variationItem.value;
							const isSelected = selectedVariations[group.label] === variation;

							return group.label === 'Name' ? (
								<input
									key={group.label}
									type="text"
									name={group.label}
									value={selectedVariations[group.label] || ""}
									onChange={(e) => handleVariationChange(group.label, e.target.value)}
									className={styles.nameInput}
									required
								/>
							) : (
								<label key={index} className={clsx(styles.variation, isSelected && styles.selected)}>
									<input
										type="radio"
										name={group.label}
										value={variation}
										checked={isSelected}
										onChange={() => handleVariationChange(group.label, variation)}
										className={styles.radioInput}
									/>
									{isSelected && (
										<span className={styles.checkmark}>
											<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
												<polyline points="20 6 9 17 4 12"></polyline>
											</svg>
										</span>
									)}
									<span className={styles.variationText}>{variation}</span>
								</label>
							);
						})}
					</div>
				</div>
			))}

			{/* Quantity adjustment with buttons */}
			{product?.moq > 1 && (
				<div className={styles.quantityContainer}>
					<p className={styles.quantityLabel}>Quantity</p>

					<span
						onClick={() => { const newQuantity = Math.max(quantity - 1, 1); handleQuantityChange(newQuantity); }}
						disabled={quantity <= 1}
						className={styles.quantityButton}>
						-
					</span>

					<span className={styles.quantityValue}>{quantity}</span>

					<span
						onClick={() => { const newQuantity = Math.min(quantity + 1, product?.moq); handleQuantityChange(newQuantity); }}
						disabled={quantity >= product?.moq}
						className={styles.quantityButton}>
						+
					</span>
				</div>
			)}

			<div className={styles.actionsContainer}>
				<button
					type="button"
					className={clsx(styles.addToBasketButton, error && styles.error)}
					onClick={(e) => addToBasket(e.currentTarget)}
					disabled={isDisabled}>
					{error ?
						error :
						isDisabled ? 'Added to basket' : 'Add to basket'}
				</button>

				{product?.category && product?.category?.data && (
					<div>
						{(() => {
							// Get category URL - use plural_url if available, otherwise use uid
							const categorySlug = isFilled.keyText(product?.category?.data?.plural_url)
								? product.category.data.plural_url
								: product?.category?.uid || '';

							// Pluralize category name
							const categoryName = product?.category?.data?.name || '';
							const pluralizedName = categoryName
								? (categoryName.endsWith('s') || categoryName.endsWith('x') || categoryName.endsWith('z') || categoryName.endsWith('ch') || categoryName.endsWith('sh')
									? categoryName + 'es'
									: categoryName.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(categoryName[categoryName.length - 2])
										? categoryName.slice(0, -1) + 'ies'
										: categoryName + 's')
								: '';

							return (
								<Link href={`/${categorySlug}`} className={styles.viewAllLink}>
									View all {pluralizedName}
								</Link>
							);
						})()}
					</div>
				)}
			</div>
		</div>
	);
};
