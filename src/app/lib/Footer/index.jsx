import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { PrismicNextLink } from '@prismicio/next';
import { isFilled } from '@prismicio/helpers';
import { PaymentIcons } from '@/app/lib/PaymentIcons';
import styles from './footer.module.css';

export function Footer({ menuData }) {
	const bottomMenuLinks = menuData?.data?.bottom_menu_link || [];
	const footerColumns = menuData?.data?.column || [];

	// Split bottomMenuLinks into chunks of 6
	const chunkSize = 6;
	const categoryColumns = [];
	for (let i = 0; i < bottomMenuLinks.length; i += chunkSize) {
		categoryColumns.push(bottomMenuLinks.slice(i, i + chunkSize));
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.containerInner}>
				<div className={styles.menuContainer}>

					{/* Category Columns - up to 6 links per column */}
					{/* {categoryColumns.map((columnLinks, columnIndex) => (
						<div key={columnIndex} className={styles.categoriesColumn}>
							{columnIndex === 0 && <p className={styles.columnTitle}>Categories</p>}
							<ul className={styles.columnList}>
								{columnLinks.map((link, linkIndex) => (
									<li key={linkIndex} className={styles.columnItem}>
										<PrismicNextLink field={link} className={styles.columnLink}>
											{link.text}
										</PrismicNextLink>
									</li>
								))}
							</ul>
						</div>
					))} */}

					{/* Footer Columns */}
					{footerColumns.map((column, columnIndex) => (
						<div key={columnIndex} className={clsx(styles.footerColumn, styles.normalColumn)}>
							{column.title && (
								<p className={styles.columnTitle}>{column.title}</p>
							)}
							{column.link && Array.isArray(column.link) && column.link.length > 0 && (
								<ul className={styles.columnList}>
									{column.link.map((link, linkIndex) => (
										<li key={linkIndex} className={styles.columnItem}>
											<PrismicNextLink field={link} className={styles.columnLink}>
												{link.text}
											</PrismicNextLink>
										</li>
									))}
								</ul>
							)}
						</div>
					))}

					<PaymentIcons title="We accept" />

				</div>

				<div className={styles.copyright}>
					{new Date().getFullYear()} &copy; My Book Nook. All rights reserved.
				</div>
			</div>

		</div>
	);
}
