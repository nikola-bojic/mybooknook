"use client";

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import clsx from 'clsx';
import Link from 'next/link';
import { isFilled } from '@prismicio/helpers';
import { PrismicRichText } from '@prismicio/react';
import { useBasket } from '@/app/context/BasketContext';
import { PrismicNextImage } from '@prismicio/next';
// import { DiscountCode } from '@/app/lib/DiscountCode';
import { CountrySelector } from '@/app/lib/CountrySelector';
import { Settings } from '@/app/lib/settings';
import { calculateTotalPostage, calculateOriginalTotalPrice, calculateDiscountedTotalPrice } from '@/app/lib/utils';
import styles from './basket.module.css';
import sharedStyles from '@/app/shared.module.css';
import variationsStyles from '@/app/lib/VariationAndBasketButton/variations.module.css';

export const Basket = ({ slice, isCheckout = false, onReselectCountry }) => {
	const { basket, setBasket } = useBasket();
	const [originalTotalPrice, setOriginalTotalPrice] = useState(0);
	const [discountedTotalPrice, setDiscountedTotalPrice] = useState(0);
	const [totalPostage, setTotalPostage] = useState(0);
	const [discount, setDiscount] = useState({ code: null, discount: 0 });
	const [selectedCountry, setSelectedCountry] = useState("GB");

	useEffect(() => {
		const storedBasket = Cookies.get(Settings.cookieName);
		const parsedBasket = storedBasket ? JSON.parse(storedBasket) : null;

		if (parsedBasket?.country) {
			setSelectedCountry(parsedBasket?.country)
		}

		if (parsedBasket?.discount) {
			setDiscount(parsedBasket?.discount);
		}

		setDiscountedTotalPrice(calculateDiscountedTotalPrice(parsedBasket, parsedBasket?.discount?.discount ?? 0));
		setOriginalTotalPrice(calculateOriginalTotalPrice(parsedBasket));
		setTotalPostage(calculateTotalPostage(parsedBasket, parsedBasket?.country));

		setBasket(parsedBasket);

	}, []);

	useEffect(() => {
		if (!onReselectCountry) return;
		selectCountry(onReselectCountry);
	}, [onReselectCountry]);

	const handleQuantityChange = (productIndex, newQuantity) => {
		const updatedBasket = { ...basket };
		updatedBasket.products[productIndex].quantity = newQuantity;

		const cookieData = { ...updatedBasket, discount };
		Cookies.set(Settings.cookieName, JSON.stringify(cookieData), { expires: 7 });

		setOriginalTotalPrice(calculateOriginalTotalPrice(updatedBasket));
		setDiscountedTotalPrice(calculateDiscountedTotalPrice(updatedBasket, discount.discount));
		setTotalPostage(calculateTotalPostage(updatedBasket, updatedBasket?.country));
		setBasket(updatedBasket);

	};

	const removeProduct = (productIndex) => {
		const updatedBasket = { ...basket };
		updatedBasket.products.splice(productIndex, 1);

		const cookieData = { ...updatedBasket, discount };
		Cookies.set(Settings.cookieName, JSON.stringify(cookieData), { expires: 7 });

		setOriginalTotalPrice(calculateOriginalTotalPrice(updatedBasket));
		setDiscountedTotalPrice(calculateDiscountedTotalPrice(updatedBasket, discount.discount));
		setTotalPostage(calculateTotalPostage(updatedBasket, updatedBasket?.country));
		setBasket(updatedBasket);

	};

	const applyDiscount = (discountData) => {
		if (discountData.discount === 0) return;

		setDiscount(discountData);
		const cookieData = { ...basket, discount: discountData };
		Cookies.set(Settings.cookieName, JSON.stringify(cookieData), { expires: 7 });

		const discountedPrice = calculateDiscountedTotalPrice(basket, discountData.discount);
		setDiscountedTotalPrice(discountedPrice);

		setBasket(cookieData);
	};

	const selectCountry = (countryData) => {
		setSelectedCountry(countryData);

		const storedBasket = Cookies.get(Settings.cookieName);
		const parsedBasket = storedBasket ? JSON.parse(storedBasket) : null;
		const cookieData = { ...parsedBasket, country: countryData };
		Cookies.set(Settings.cookieName, JSON.stringify(cookieData), { expires: 7 });

		setTotalPostage(calculateTotalPostage(parsedBasket, countryData));
		setBasket(cookieData);
	};

	const changeCountry = () => {
		setSelectedCountry(null)
	};

	if (!basket || !basket.products || basket.products.length === 0 && isFilled.richText(slice?.primary?.empty_basket_message)) {
		return (
			<div className={styles.emptyBasketContainer}>
				<div className={clsx(styles.emptyBasketMessage, sharedStyles.richText)}>
					<PrismicRichText field={slice?.primary?.empty_basket_message} />
				</div>
			</div>
		);
	}

	return (
		<div className={clsx(styles.mainContainer, !isCheckout && styles.mainContainerCheckout)}>
			{!isCheckout ? (
				<div className={styles.productsList}>
					{basket.products.map((product, index) => (
						<div key={index} className={styles.productRow}>
							<div className={styles.productImageSection}>

								<Link href={product.url} className={styles.imageSm}>
									<PrismicNextImage className={styles.productImage} field={product.image} />
								</Link>

								<div className={styles.mobileTitleContainer}>
									<Link href={product.url} className={clsx(styles.mobileTitleLink, styles.link)}>
										<h4 className={clsx(styles.productTitle, styles.title)}>{product.title}</h4>
									</Link>
								</div>
							</div>

							<div className={styles.productDetailsSection}>
								<div className={styles.desktopTitleContainer}>
									<Link href={product.url} className={styles.link}>
										<h4 className={clsx(styles.productTitle, styles.title)}>{product.title}</h4>
									</Link>
								</div>

								{/* variations, quantity, remove */}
								<div className={styles.productDetails}>

									{/* Selected variations */}
									{product.selectedVariation ? (
										Object.entries(product.selectedVariation).map(([label, variation], varIndex) => (
											<div className={styles.variationItem} key={varIndex}>
												<strong>{label}: </strong>{variation}
											</div>
										))
									) : null}

									{/* Quantity input */}
									{product.moq > 1 && (
										<div className={styles.quantityContainer}>
											<strong>Quantity:&nbsp;</strong>

											<span onClick={() => {
												const newQuantity = Math.max(product.quantity - 1, 1);
												handleQuantityChange(index, newQuantity);
											}} disabled={product.quantity <= 1} className={clsx(variationsStyles.quantityButton)}>
												-
											</span>

											<span className={clsx(variationsStyles.quantityValue)}>{product.quantity}</span>

											<span onClick={() => {
												const newQuantity = Math.min(product.quantity + 1, product?.moq);
												handleQuantityChange(index, newQuantity);
											}}
												disabled={product.quantity >= product?.moq}
												className={clsx(variationsStyles.quantityButton)}>
												+
											</span>
										</div>
									)}

									{/* Mobile - price */}
									<div className={styles.mobilePrice}>
										<strong>Price:&nbsp;</strong>£{(product.price * product.quantity).toFixed(2)}
									</div>

									{/* Mobile - Remove button */}
									<span className={clsx(styles.mobileRemove, styles.remove)} onClick={() => removeProduct(index)}>
										Remove
									</span>
								</div>
							</div>

							{/* Price & Remove */}
							<div className={styles.priceSection}>

								{/* Price */}
								<h4 className={styles.productPrice}>
									£{(product.price * product.quantity).toFixed(2)}
								</h4>

								{/* Desktop - Remove button */}
								{/* <span className={clsx(styles.desktopRemove, styles.remove)} onClick={() => removeProduct(index)}>
									Remove
								</span> */}
							</div>
						</div>
					))}
				</div>
			) : null}

			{selectedCountry ? (
				<>
					<div className={styles.totalsContainer}>

						{/* Original total price */}
						<div className={styles.totalsColumn}>
							<div className={styles.totalRow}>
								<p className={styles.totalLabel}>Price</p>
								<b className={styles.figure}>
									£{originalTotalPrice.toFixed(2)}
									{discount.discount ? (
										<span className={styles.hasDiscount} />
									) : null}
								</b>
							</div>

							{/* Discounted total price */}
							{discount.discount > 0 && (
								<div className={styles.totalRow}>
									<p className={styles.totalLabel}>Discounted price</p>
									<b className={styles.figure}>£{discountedTotalPrice.toFixed(2)}</b>
								</div>
							)}

							{/* Total postage */}
							<div className={styles.totalRow}>
								{isCheckout ? (
									<p className={styles.totalLabel}>Postage</p>
								) : (
									// <p className={styles.totalLabel}>Postage to <span onClick={changeCountry} className={styles.clickableLink}>{basket?.country?.name}</span></p>
									<p className={styles.totalLabel}>Postage</p>
								)}
								{/* <b className={styles.figure}>£{totalPostage.toFixed(2)}</b> */}
								<b className={styles.figure}>FREE</b>
							</div>

							{/* Total price (considering postage and discount) */}
							<div className={styles.totalPriceRow}>
								<p className={styles.totalLabelLarge}>Total</p>
								<b className={clsx(styles.figure, styles.total)}>£{((discountedTotalPrice ? discountedTotalPrice : originalTotalPrice) + totalPostage).toFixed(2)}</b>
							</div>
						</div>

						{/* Discount code input */}
						{/* {!isCheckout && (
							<div className={styles.discountCodeContainer}>
								<DiscountCode onDiscountVerified={applyDiscount} />
							</div>
						)} */}

					</div>

					{/* Checkout button */}
					{!isCheckout && (
						<div className={styles.checkoutButtonContainer}>
							<div className={styles.checkoutButtonWrapper}>
								<Link href='/checkout' className={styles.checkoutButton}>
									Checkout
								</Link>
							</div>
						</div>
					)}
				</>
			) : (
				<div className={styles.countrySelectorContainer}>
					<p className={styles.countrySelectorText}>Please select your country to see the total price.</p>
					<CountrySelector onCountrySelected={selectCountry} button={true} />
				</div>
			)}
		</div>
	);
};
