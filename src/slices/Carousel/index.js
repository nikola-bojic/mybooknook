'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { isFilled } from '@prismicio/helpers';
import { PrismicNextImage } from '@prismicio/next';
import { Autoplay, Keyboard, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import { linkResolver } from '@/app/lib/linkResolver';
import { sliceStyle } from '@/app/lib/utils';
import styles from './carousel.module.css';
import sharedStyles from '@/app/shared.module.css';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/keyboard';
import 'swiper/css/navigation';

export const Carousel = ({ slice }) => {
	const [swiper, setSwiper] = useState(null);

	if (slice?.primary?.slide?.length === 0) return null;

	return (
		<div className={clsx(styles.wrapper, sharedStyles.wrapper)} style={sliceStyle(slice?.primary)}>
			<Swiper
				className={clsx('swiper', styles.swiper)}
				modules={[Autoplay, Keyboard, Navigation]}
				onSwiper={setSwiper}
				initialSlide={slice?.primary?.initial_slide && slice?.primary?.slide[slice?.primary?.initial_slide - 1] ? slice?.primary?.initial_slide - 1 : 0}
				spaceBetween={0}
				slidesPerView={1}
				keyboard={{
					enabled: true,
				}}
				navigation={true}
				{...(slice?.primary?.autoplay && {
					autoplay: {
						delay: 5000,
						pauseOnMouseEnter: false,
					},
				})}
				loop={true}
				pagination={false}
			>

				{slice?.primary?.slide?.map((item, index) => {
					if (isFilled.image(item?.image)) {

						return (
							<SwiperSlide
								className={clsx(styles.slide)}
								key={index}
							>
								<div className={styles.link}>
								<PrismicNextImage
									className={clsx(styles.image)}
									field={item?.image}
								/>
									{(isFilled.keyText(item?.title) || isFilled.keyText(item?.subtitle) || isFilled.link(item?.link)) && (
										<div className={clsx(styles.content)}>
											{isFilled.keyText(item?.title) && <h2>{item?.title}</h2>}
											{isFilled.keyText(item?.subtitle) && <p>{item?.subtitle}</p>}
											{isFilled.link(item?.link) && (() => {
												// Resolve the link URL manually to ensure plural_url is used
												let href = '/';
												if (item?.link?.link_type === 'Document' && item?.link) {
													// Construct a document-like object for linkResolver
													// The link might have data populated via fetchLinks
													// Try to extract plural_url from various possible locations
													const linkData = item.link.data || {};
													const pluralUrl = linkData.plural_url || item.link.plural_url;

													const document = {
														type: item.link.type,
														uid: item.link.uid,
														// Don't include url if we have plural_url - let linkResolver handle it
														url: pluralUrl ? undefined : item.link.url,
														isBroken: item.link.isBroken,
														// Include data with plural_url properly set
														data: {
															...linkData,
															// Ensure plural_url is in data for linkResolver to find it
															plural_url: pluralUrl || linkData.plural_url
														}
													};
													href = linkResolver(document);
												} else if (item?.link?.link_type === 'Web' && item?.link?.url) {
													// Use URL directly for web links
													href = item.link.url;
												} else if (typeof item?.link === 'string') {
													// Handle string URLs
													href = item.link;
												}
												return (
													<Link href={href} className={styles.button}>
														{item?.link?.text || 'Shop now'}
													</Link>
												);
											})()}
										</div>
									)}
								</div>
							</SwiperSlide>
						);
					}
				})}
			</Swiper>
		</div>
	);
};