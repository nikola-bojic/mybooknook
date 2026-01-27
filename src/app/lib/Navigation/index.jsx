"use client";

import React, { useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { PrismicNextLink, PrismicNextImage } from '@prismicio/next';
import { isFilled } from '@prismicio/helpers';
import { linkResolver } from '@/app/lib/linkResolver';
import { useBasket } from '@/app/context/BasketContext';
import { triggerConfettiFromElement } from '@/app/lib/confetti';
import styles from './navigation.module.css';

const GIFT_IDEAS_LABEL = 'Gift Ideas';

function triggerGiftConfetti(e) {
	const el = e?.currentTarget;
	if (el) triggerConfettiFromElement(el);
}

const BasketIcon = () => (
	<svg viewBox="0 0 24 24" className={styles.basketIcon} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
		<line x1="3" y1="6" x2="21" y2="6" />
		<path d="M16 10a4 4 0 0 1-8 0" />
	</svg>
);

const HomeIcon = () => (
	<svg viewBox="0 0 24 24" className={styles.homeIcon} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
		<polyline points="9 22 9 12 15 12 15 22" />
	</svg>
);

export function Navigation({ menuData }) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { basket } = useBasket();

	const topMenuLinks = menuData?.data?.top_menu_link || [];
	const bottomMenuLinks = menuData?.data?.bottom_menu_link || [];
	const logo = menuData?.data?.logo;

	// Calculate basket item count
	const basketItemCount = basket?.products?.reduce((total, product) => total + (product.quantity || 0), 0) || 0;

	return (
		<div className={styles.wrapper}>

			<div className={styles.notice}>
				<b>FREE</b> delivery on all orders
			</div>

			<div className={styles.container}>

				{/* First Row: Logo left, Top menu links right */}
				<div className={styles.topRow}>
					<div className={styles.logoContainer}>
						{isFilled.image(logo) && (
							<Link href='/' className={styles.logo}>
								<PrismicNextImage field={logo} className={styles.logoImage} />
							</Link>
						)}
					</div>

					{topMenuLinks.length > 0 && (
						<nav className={styles.topNav}>
							<ul className={styles.topList}>
								<li className={clsx(styles.topItem, styles.mobileHomeLink)}>
									<Link href='/' className={styles.topLink}>
										<HomeIcon />
									</Link>
								</li>
								{topMenuLinks.map((link, index) => {
									const isBasket = link.variant === 'Basket';
									const isGiftIdeas = link.text === GIFT_IDEAS_LABEL;
									return (
										<li key={index} className={styles.topItem}>
											<PrismicNextLink
												field={link}
												linkResolver={linkResolver}
												className={styles.topLink}
												onMouseEnter={isGiftIdeas ? triggerGiftConfetti : undefined}
											>
												{isBasket && <BasketIcon />}
												{link.text}
												{isBasket && basketItemCount > 0 && (
													<span className={styles.basketBadge}>{basketItemCount}</span>
												)}
											</PrismicNextLink>
										</li>
									);
								})}
							</ul>
						</nav>
					)}
				</div>

				{/* Mobile shop button - only show if there are bottom menu links */}
				{bottomMenuLinks.length > 0 && (
					<button
						className={clsx(styles.mobileShopButton, mobileMenuOpen && styles.mobileShopButtonOpen)}
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						aria-label="Toggle shop menu"
					>
						{mobileMenuOpen ? 'Close' : 'Browse all categories'}
					</button>
				)}
			</div>

			{/* Second Row: Bottom menu links centered - Full width */}
			{bottomMenuLinks.length > 0 && (
				<nav className={clsx(styles.bottomNav, mobileMenuOpen && styles.bottomNavOpen)}>
					<div className={styles.bottomNavContainer}>
						<ul className={styles.bottomList}>
							{bottomMenuLinks.map((link, index) => {
								const isGiftIdeas = link.text === GIFT_IDEAS_LABEL;
								return (
									<li key={index} className={styles.bottomItem}>
										<PrismicNextLink
											field={link}
											linkResolver={linkResolver}
											className={styles.bottomLink}
											onMouseEnter={isGiftIdeas ? triggerGiftConfetti : undefined}
										>
											{link.text}
										</PrismicNextLink>
									</li>
								);
							})}
						</ul>
					</div>
				</nav>
			)}
		</div>
	);
}
