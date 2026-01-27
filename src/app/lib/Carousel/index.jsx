"use client";

import React, { useState } from 'react';
import clsx from 'clsx';
import { isFilled } from '@prismicio/helpers';
import { PrismicNextImage } from '@prismicio/next'
import { Navigation, Keyboard, Thumbs, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import styles from './carousel.module.css';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/keyboard';
import 'swiper/css/thumbs';

export function Carousel({ gallery }) {
	const [thumbsSwiper, setThumbsSwiper] = useState(null);

	const validGalleryItems = gallery?.filter(item =>
		isFilled.image(item?.image) || isFilled.linkToMedia(item?.stl_file)
	) || [];

	if (validGalleryItems.length === 0) return null;

	return (
		<div className={styles.wrapper}>

			{/* Main Swiper */}
			<Swiper
				className={styles.mainSwiper}
				modules={[Navigation, Keyboard, Thumbs, Autoplay]}
				autoplay={{
					delay: 2500,
					disableOnInteraction: true,
				}}
				spaceBetween={0}
				slidesPerView={1}
				keyboard={{
					enabled: true,
				}}
				loop={true}
				navigation={validGalleryItems.length > 1}
				pagination={false}
				thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
			>
				{validGalleryItems.map((item, index) => (
					<SwiperSlide className={styles.slide} key={index}>
						<div className={styles.slideContent}>
							<div className={styles.imageContainer}>
								{isFilled.image(item?.image) && !isFilled.linkToMedia(item?.stl_file) && (
									<PrismicNextImage className={styles.image} field={item?.image} />
								)}
							</div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>

			{/* Thumbnails Swiper */}
			{validGalleryItems.length > 1 && (
				<Swiper
					className={styles.thumbsSwiper}
					modules={[Thumbs]}
					onSwiper={setThumbsSwiper}
					spaceBetween={8}
					slidesPerView={5}
					freeMode={true}
					watchSlidesProgress={true}
					breakpoints={{
						0: {
							slidesPerView: 3,
							spaceBetween: 6,
						},
						640: {
							slidesPerView: 5,
							spaceBetween: 8,
						}
					}}
				>
					{validGalleryItems.map((item, index) => (
						<SwiperSlide className={styles.thumbSlide} key={index}>
							{isFilled.image(item?.image) && !isFilled.linkToMedia(item?.stl_file) && (
								<PrismicNextImage className={styles.thumbImage} field={item?.image} />
							)}
						</SwiperSlide>
					))}
				</Swiper>
			)}
		</div>
	);
}
