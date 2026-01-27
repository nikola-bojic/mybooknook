'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { PrismicRichText } from '@prismicio/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import IconLoader from '@/assets/icons/icon-loader.svg';
import sharedStyles from '@/app/shared.module.css';
import styles from './contactForm.module.css';

export const ContactForm = ({ slice }) => {
	const [submissionState, setSubmissionState] = useState('initial');
	const [isLoading, setIsLoading] = useState(false);

	const validationSchema = Yup.object().shape({
		name: Yup.string().required('Please enter your name'),
		email: Yup.string().email('Please enter a valid email address').required('Please enter your email address'),
		message: Yup.string().required('Please enter your message')
	});

	const {
		register,
		handleSubmit,
		reset,
		formState: { dirtyFields, errors },
	} = useForm({
		defaultValues: {
			name: '',
			email: '',
			message: '',
		},
		shouldFocusError: true,
		mode: 'onChange',
		resolver: yupResolver(validationSchema),
	});

	const onSubmit = async (formData) => {
		if (isLoading) return false;

		try {
			setIsLoading(true);

			const response = await fetch('/api/send-mail', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				setSubmissionState('success');
				reset();

			} else {
				setSubmissionState('error');

			}

		} catch (error) {
			console.error('Error', error);
			setSubmissionState('error');

		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={styles.container}>

			{submissionState === 'initial' || submissionState === 'error' ? (
				<div className={styles.formContainer}>
					<form
						className={styles.formInner}
						onSubmit={handleSubmit(onSubmit)}
						noValidate>

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
											{errors.name?.message}
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
								<div className={clsx(
									styles.inputWrap,
									errors.email && styles.error,
									dirtyFields.email && !errors.email && styles.valid,
								)}>
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

						{/* message */}
						<div className={styles.formRow}>
							<label className={styles.label} htmlFor="message">
								Your message
							</label>

							<div className={styles.inputContainer}>
								<div className={clsx(
									styles.inputWrap,
									errors.message && styles.error,
									dirtyFields.message && !errors.message && styles.valid,
								)}>
									<textarea
										className={styles.textarea}
										rows={4}
										tabIndex={3}
										id="message"
										{...register('message')}
									/>
									<span className="icon" />
								</div>

								{errors.message?.message && (
									<div className={styles.errorText}>
										<p className={styles.errorMessageText}>
											{errors.message?.message}
										</p>
									</div>
								)}

								<div className={styles.buttonContainer}>
									<button type="submit" className={styles.submitButton} tabIndex={4} disabled={isLoading}>
										{isLoading ? <IconLoader /> : 'Send'}
									</button>
								</div>

							</div>
						</div>
					</form>
				</div>

			) : submissionState === 'success' ? (
				<div className={clsx(styles.successContainer, sharedStyles.richText)}>
					<PrismicRichText field={slice.primary?.confirmation_message} />
				</div>
			) : null}
		</div>
	);
}
