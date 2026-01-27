'use client';

import React, { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const pageview = (url) => {
	if (typeof window !== 'undefined' && typeof window.dataLayer !== 'undefined') {
		window.dataLayer.push({
			event: 'pageview',
			page: url,
		});
	}
};

const trackScrollDepth = () => {
	if (typeof window === 'undefined' || typeof window.dataLayer === 'undefined') return;

	const scrollDepth = Math.round(
		((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
	);

	// Track at 25%, 50%, 75%, and 100% scroll depth
	const milestones = [25, 50, 75, 100];
	const trackedMilestones = window.scrollDepthTracked || [];

	milestones.forEach((milestone) => {
		if (scrollDepth >= milestone && !trackedMilestones.includes(milestone)) {
			window.dataLayer.push({
				event: 'scroll_depth',
				scroll_depth: milestone,
				page: window.location.pathname,
			});
			trackedMilestones.push(milestone);
		}
	});

	window.scrollDepthTracked = trackedMilestones;
};

export function GoogleTagManagerTracker() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		// Track page view on route change
		if (pathname) {
			const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
			pageview(url);
			
			// Reset scroll tracking for new page
			if (typeof window !== 'undefined') {
				window.scrollDepthTracked = [];
			}
		}
	}, [pathname, searchParams]);

	useEffect(() => {
		// Track scroll depth
		let ticking = false;

		const handleScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					trackScrollDepth();
					ticking = false;
				});
				ticking = true;
			}
		};

		// Track initial scroll depth
		trackScrollDepth();

		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [pathname]);

	// Track time on page
	useEffect(() => {
		const startTime = Date.now();

		const trackTimeOnPage = () => {
			if (typeof window !== 'undefined' && typeof window.dataLayer !== 'undefined') {
				const timeOnPage = Math.round((Date.now() - startTime) / 1000); // in seconds
				window.dataLayer.push({
					event: 'time_on_page',
					time_on_page: timeOnPage,
					page: window.location.pathname,
				});
			}
		};

		// Track time on page every 30 seconds
		const interval = setInterval(trackTimeOnPage, 30000);

		// Track on page unload
		const handleBeforeUnload = () => {
			trackTimeOnPage();
		};

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			clearInterval(interval);
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, [pathname]);

	return null;
}
