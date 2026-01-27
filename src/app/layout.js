import { PrismicPreview } from '@prismicio/next'
import { repositoryName } from '@/prismicio'
import { ToastContainer } from 'react-toastify';
import { Analytics } from "@vercel/analytics/react"
import { GoogleTagManager } from '@next/third-parties/google'
import { Suspense } from 'react';
import { Dongle, DM_Serif_Display } from "next/font/google";
import { BasketProvider } from '@/app/context/BasketContext';
import { CookieWarning } from '@/app/lib/CookieWarning';
import { Navigation } from "@/app/lib/Navigation";
import { Footer } from "@/app/lib/Footer";
import { StructuredData } from '@/app/lib/StructuredData';
import { GoogleTagManagerTracker } from '@/app/lib/GoogleTagManagerTracker';
import { getMenuData } from '@/app/lib/data';
import './globals.css';

const dongle = Dongle({
	weight: ['300', '400', '700'],
	style: ['normal'],
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-dongle',
});

const concertOne = DM_Serif_Display({
	weight: ['400'],
	style: ['normal'],
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-concert-one',
});

export const metadata = {
	title: "My Book Nook",
};

export default async function RootLayout({ children }) {
	const menuData = await getMenuData();

	return (
		<html lang="en">
			{process.env.NEXT_PUBLIC_GTM_ID && (
				<>
					<GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
					<Suspense>
						<GoogleTagManagerTracker />
					</Suspense>
				</>
			)}
			<body className={`${dongle.variable} ${concertOne.variable}`}>
				<StructuredData type="organization" />
				<StructuredData type="website" />
				<BasketProvider>

					<Navigation menuData={menuData} />

					{children}

					<ToastContainer
						position="top-right"
						autoClose={5000}
						hideProgressBar
						newestOnTop={true}
						closeOnClick
						pauseOnFocusLoss
						draggable
						pauseOnHover
						theme="colored"
						icon={false}
						className="custom-toast-container" />

					<CookieWarning />

					<PrismicPreview repositoryName={repositoryName} />

					<Footer menuData={menuData} />

					<Analytics />

				</BasketProvider>
			</body>
		</html>
	);
}
