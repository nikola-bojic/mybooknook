'use client';

import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { PrismicRichText } from '@prismicio/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useBasket } from '@/app/context/BasketContext';
import { Basket } from '@/slices/Basket';
import { CountrySelector } from '@/app/lib/CountrySelector';
import { Settings } from '@/app/lib/settings';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PayPalButton } from '@/app/lib/PayPalButton';
import { PaymentIcons } from '@/app/lib/PaymentIcons';
import IconLoader from '@/assets/icons/icon-loader.svg';
import styles from './slice.module.css';
import sharedStyles from '@/app/shared.module.css';

export const CheckoutForm = ({ slice }) => {
	const { basket, setBasket } = useBasket();
	const [submissionState, setSubmissionState] = useState('initial');
	const [submissionError, setSubmissionError] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({});
	const [reselectCountry, setReselectCountry] = useState();

	const initialPayPalOptions = {
		clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
		currency: "GBP",
		components: "buttons",
	};

	const validationSchema = Yup.object().shape({
		name: Yup.string().required('Please enter your name'),
		email: Yup.string().email('Please enter a valid email address').required('Please enter your email address'),
		address_line_1: Yup.string().required('Please enter your address'),
		address_line_2: Yup.string().required('Please enter your city'),
		address_line_3: Yup.string().optional(),
		// country_code: Yup.string().required('Please select your country'),
		postcode: Yup.string().required('Please enter your postcode'),
		// message: Yup.string().optional()
	});

	const {
		register,
		formState: { dirtyFields, errors, isValid },
		watch,
		setValue,
		trigger,
		setFocus
	} = useForm({
		defaultValues: {
			name: '',
			email: '',
			address_line_1: '',
			address_line_2: '',
			address_line_3: '',
			// country_code: basket?.country?.code,
			country_code: 'GB',
			postcode: '',
			// message: '',
		},
		shouldFocusError: true,
		mode: 'onChange',
		resolver: yupResolver(validationSchema),
	});

	// useEffect(() => {
	// 	if (!basket || !basket?.country) return;
	// 	setValue('country_code', basket?.country?.code, { shouldValidate: true });
	// }, [basket]);

	// const selectCountry = (countryData) => {
	// 	setValue('country_code', countryData?.code, { shouldValidate: true });
	// 	setReselectCountry(countryData);

	// 	const storedBasket = Cookies.get(Settings.cookieName);
	// 	const parsedBasket = storedBasket ? JSON.parse(storedBasket) : null;
	// 	const cookieData = { ...parsedBasket, country: countryData };
	// 	Cookies.set(Settings.cookieName, JSON.stringify(cookieData), { expires: 7 });
	// };

	// Watch all form fields
	const watchedFields = watch();

	// Update formData when watched fields change
	useEffect(() => {
		// Avoid setting state if data is the same to prevent unnecessary renders
		setFormData(prevData => {
			if (JSON.stringify(prevData) !== JSON.stringify(watchedFields)) {
				return watchedFields;
			}
			return prevData;
		});
	}, [watchedFields]);

	const triggerValidation = () => {
		trigger();

		setTimeout(() => {
			const firstError = Object.keys(errors)[0];
			if (firstError) {
				setFocus(firstError);
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}, 100);
	};

	const approvePurchase = () => {
		const mainElement = document.querySelector('main > div > div');

		if (mainElement) {
			if (mainElement.children.length > 0) {
				mainElement.removeChild(mainElement.children[0]);
			}
		}

		setSubmissionState('success');

		// remove all products from the basket
		const updatedBasket = { ...basket };
		updatedBasket.products = [];

		const cookieData = { ...updatedBasket };
		Cookies.set(Settings.cookieName, JSON.stringify(cookieData), { expires: 7 });

		setBasket(updatedBasket);

	}

	if (!basket?.products?.length && (submissionState === 'initial' || submissionState === 'error')) return (
		<div className={styles.emptyBasketContainer}>
			<Basket isCheckout={false} slice={slice} />
		</div>
	)

	return (
		<PayPalScriptProvider options={initialPayPalOptions}>
			<div className={styles.container}>

				{submissionState === 'initial' || submissionState === 'error' ? (
					<div className={styles.formContainer}>
						<div className={styles.formInner}>
							<div className={styles.formSection}>

								{submissionState === 'error' ? (
									<div className={clsx(styles.errorMessage, sharedStyles.richText)}>
										<PrismicRichText field={slice?.primary?.error_message} />
									</div>
								) : null}

								{/* name */}
								<div className={styles.formRow}>
									<label className={styles.label} htmlFor="name">
										Your name
									</label>

									<div className={styles.inputContainer}>
										<div className={clsx(
											styles.inputWrap,
											errors.name && styles.error,
											dirtyFields.name && !errors.name && styles.valid,
										)}>
											<input
												className={styles.input}
												type="text"
												tabIndex={1}
												autoComplete='name'
												id="name"
												{...register('name')}
											/>
											<span className="icon" />
										</div>

										{errors.name?.message && (
											<div className={styles.errorText}>
												<p className={styles.errorMessageText}>
													{errors?.name?.message}
												</p>
											</div>
										)}
									</div>
								</div>

								{/* email */}
								<div className={styles.formRow}>
									<label className={styles.label} htmlFor="email">
										Your email
									</label>

									<div className={styles.inputContainer}>
										<div
											className={clsx(
												styles.inputWrap,
												errors.email && styles.error,
												dirtyFields.email && !errors.email && styles.valid,
											)}
										>
											<input
												className={styles.input}
												type="email"
												tabIndex={2}
												autoComplete='email'
												id="email"
												{...register('email')}
											/>
											<span className="icon" />
										</div>

										{errors.email?.message && (
											<div className={styles.errorText}>
												<p className={styles.errorMessageText}>
													{errors.email?.message}
												</p>
											</div>
										)}
									</div>
								</div>

								{/* address */}
								<div className={styles.formRow}>
									<label className={styles.label} htmlFor="address_line_1">
										Your address
									</label>

									<div className={styles.inputContainer}>
										<div className={clsx(
											styles.inputWrap,
											styles.mb2,
											errors.address_line_1 && styles.error,
											dirtyFields.address_line_1 && !errors.address_line_1 && styles.valid,
										)}>
											<input
												className={styles.inputNoMargin}
												type="text"
												tabIndex={3}
												autoComplete='address-line1'
												id="address_line_1"
												{...register('address_line_1')}
											/>
											<span className="icon" />
										</div>

										{errors?.address_line_1?.message ? (
											<div className={styles.errorText}>
												<p className={styles.errorMessageTextNoMargin}>
													{errors?.address_line_1?.message}
												</p>
											</div>
										) : null}

										<div
											className={clsx(
												styles.inputWrap,
												styles.mb2,
												errors.address_line_2 && styles.error,
												dirtyFields.address_line_2 && !errors.address_line_2 && styles.valid,
											)}
										>
											<input
												className={styles.input}
												type="text"
												tabIndex={4}
												autoComplete='address-line2'
												id="address_line_2"
												{...register('address_line_2')}
											/>
											<span className="icon" />
										</div>

										{errors?.address_line_2?.message ? (
											<div className={styles.errorText}>
												<p className={styles.errorMessageTextNoMarginTop}>
													{errors?.address_line_2?.message}
												</p>
											</div>
										) : null}

										<div
											className={clsx(
												styles.inputWrap,
												errors.address_line_3 && styles.error,
												dirtyFields.address_line_3 && !errors.address_line_3 && styles.valid,
											)}
										>
											<input
												className={styles.input}
												type="text"
												tabIndex={5}
												autoComplete='address-line3'
												id="address_line_3"
												{...register('address_line_3')}
											/>
											<span className="icon" />
										</div>

									</div>
								</div>

								{/* postcode */}
								<div className={styles.formRow}>
									<label className={styles.label} htmlFor="postcode">
										Postcode
									</label>

									<div className={styles.inputContainer}>
										<div
											className={clsx(
												styles.inputWrap,
												errors.postcode && styles.error,
												dirtyFields.postcode && !errors.postcode && styles.valid,
											)}
										>
											<input
												className={styles.input}
												type="text"
												tabIndex={6}
												autoComplete='postal-code'
												id="postcode"
												{...register('postcode')}
											/>
											<span className="icon" />
										</div>

										{errors?.postcode?.message ? (
											<div className={styles.errorText}>
												<p className={styles.errorMessageText}>
													{errors?.postcode?.message}
												</p>
											</div>
										) : null}
									</div>
								</div>

								{/* country */}
								<div className={styles.formRow}>
									<label className={styles.label} htmlFor="postcode">
										Country
									</label>

									<div className={styles.inputContainer}>
										<div className={styles.inputWrap}>
											<b>United Kingdom</b>
											{/* <CountrySelector onCountrySelected={selectCountry} sansButton={true} /> */}
										</div>

										{/* {basket?.country?.code !== 'GB' && (
											<div className={styles.countryWarning}>
												<p className={styles.countryWarningText}>By placing order you understand there might be additional import fees based on your country.</p>
											</div>
										)} */}
									</div>
								</div>

								{/* message */}
								{/* <div className={clsx(styles.formRow, styles.mt3)}>
									<label className={styles.label} htmlFor="message">
										Your message
									</label>

									<div className={styles.inputContainer}>
										<div
											className={clsx(
												styles.inputWrap,
												errors.message && styles.error,
												dirtyFields.message && !errors.message && styles.valid,
											)}
										>
											<textarea
												className={styles.textarea}
												rows={4}
												tabIndex={12}
												id="message"
												{...register('message')}
											/>
											<span className="icon" />
										</div>

										{errors.message?.message ? (
											<div className={styles.errorText}>
												{errors.message?.message.split('\n').map((error, index) => {
													return (
														<p key={index} className={styles.errorMessageText}>
															{error}
														</p>
													);
												})}
											</div>
										) : null}
									</div>
								</div> */}

								{/* basket */}
								<div className={clsx(styles.basketContainer)}>
									<Basket isCheckout={true} slice={slice} onReselectCountry={reselectCountry} />
								</div>

								<div className={styles.purchaseButtonContainer}>
									<div className={styles.purchaseButtonWrapper}>

										<div className={clsx(styles.purchaseButton)}>
											<PayPalButton formData={formData} basket={basket} onApprovedPurchase={approvePurchase} />
											{!isValid && (<span className={styles.validator} onClick={() => { triggerValidation() }}>&nbsp;</span>)}
										</div>

										<PaymentIcons position='checkout' title="We accept all major credit and debit cards via PayPal.
										You do not need a PayPal account to complete your purchase. 
										Simply select 'Checkout as Guest' to pay securely with your debit or a credit card." />

									</div>
								</div>
							</div>
						</div>
					</div>

				) : // successful message
					submissionState === 'success' ? (
						<div className={clsx(styles.successContainer, sharedStyles.richText)}>
							<PrismicRichText field={slice.primary?.confirmation_message} />
						</div>
					) : null}
			</div>
		</PayPalScriptProvider>
	);
}