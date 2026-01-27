import React from 'react';
import clsx from 'clsx';

import { Basket } from '@/slices/Basket';
import BlogPosts from '@/slices/BlogPosts';
import { Carousel } from '@/slices/Carousel';
import { CheckoutForm } from '@/slices/CheckoutForm';
import { ContactForm } from '@/slices/ContactForm';
import { Faq } from '@/slices/Faq';
import { Gallery } from '@/slices/Gallery';
import { Hero } from '@/slices/Hero';
import { Image } from '@/slices/Image';
import { Text } from '@/slices/Text';
import { TwoColumns } from '@/slices/TwoColumns';
import { Video } from '@/slices/Video';

export function Slices({ slices }) {
	return (
		<div className={clsx('d-flex flex-column flex-grow-1')}>
			{
				slices?.map((sliceItem, index) => {
					if (sliceItem.slice_type === 'basket') return <Basket slice={sliceItem} key={index} />;
					else if (sliceItem.slice_type === 'blog_posts') return <BlogPosts slice={sliceItem} key={index} />;
					else if (sliceItem.slice_type === 'carousel') return <Carousel slice={sliceItem} key={index} />;
					else if (sliceItem.slice_type === 'checkout_form') return <CheckoutForm slice={sliceItem} key={index} />;
					else if (sliceItem.slice_type === 'contact_form') return <ContactForm slice={sliceItem} key={index} />;
					else if (sliceItem.slice_type === 'faq') return <Faq slice={sliceItem} key={index} />;
					else if (sliceItem.slice_type === 'gallery') return <Gallery slice={sliceItem} key={index} />;
					else if (sliceItem.slice_type === 'hero') return <Hero slice={sliceItem} key={index} />;
					else if (sliceItem.slice_type === 'image') return <Image slice={sliceItem} key={index} />;
					else if (sliceItem.slice_type === 'text') return <Text slice={sliceItem} key={index} />;
					else if (sliceItem.slice_type === 'two_columns') return <TwoColumns slice={sliceItem} key={index} />;
					else if (sliceItem.slice_type === 'video') return <Video slice={sliceItem} key={index} />;
				})
			}
		</div>
	);
}
