import { createClient } from "@/prismicio";
import * as prismic from "@prismicio/client";

export const countriesByContinent = {
	uk: ["GB"],
	eu: ["AL", "AD", "AT", "BY", "BE", "BA", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GI", "GR", "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MT", "MD", "MC", "ME", "NL", "MK", "NO", "PL", "PT", "RO", "RU", "SM", "RS", "SK", "SI", "ES", "SE", "CH", "UA"],
	na: ["AG", "BS", "BB", "BZ", "CA", "CR", "CU", "DM", "DO", "SV", "GD", "GT", "HT", "HN", "JM", "MX", "NI", "PA", "KN", "LC", "VC", "TT", "US"],
	sa: ["AR", "BO", "BR", "CL", "CO", "EC", "GY", "PY", "PE", "SR", "UY", "VE"],
	af: ["DZ", "AO", "BJ", "BW", "BF", "BI", "CV", "CF", "TD", "KM", "CG", "CD", "CI", "DJ", "EG", "GQ", "ER", "ET", "GA", "GM", "GH", "GN", "GW", "KE", "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG", "RW", "ST", "SN", "SC", "SL", "SO", "ZA", "SS", "SD", "TZ", "TG", "TN", "UG", "ZM", "ZW"],
	as: ["AF", "AM", "AZ", "BH", "BD", "BT", "BN", "KH", "CN", "CY", "GE", "IN", "ID", "IR", "IQ", "IL", "JP", "JO", "KZ", "KP", "KR", "KW", "KG", "LA", "LB", "MY", "MV", "MN", "MM", "NP", "OM", "PK", "PS", "PH", "QA", "SA", "SG", "LK", "SY", "TJ", "TH", "TL", "TR", "TM", "AE", "UZ", "VN", "YE"],
	oc: ["AS", "AU", "CX", "CC", "CK", "FJ", "PF", "GU", "KI", "MH", "FM", "NR", "NC", "NZ", "NU", "NF", "MP", "PW", "PG", "PN", "WS", "SB", "TK", "TO", "TV", "VU", "WF"],
	other: ["AQ", "BV", "TF", "HM", "GS"]
};

export const countries = [
	{ code: 'AF', name: 'Afghanistan' },
	{ code: 'AX', name: 'Åland Islands' },
	{ code: 'AL', name: 'Albania' },
	{ code: 'DZ', name: 'Algeria' },
	{ code: 'AS', name: 'American Samoa' },
	{ code: 'AD', name: 'Andorra' },
	{ code: 'AO', name: 'Angola' },
	{ code: 'AI', name: 'Anguilla' },
	{ code: 'AQ', name: 'Antarctica' },
	{ code: 'AG', name: 'Antigua and Barbuda' },
	{ code: 'AR', name: 'Argentina' },
	{ code: 'AM', name: 'Armenia' },
	{ code: 'AW', name: 'Aruba' },
	{ code: 'AU', name: 'Australia' },
	{ code: 'AT', name: 'Austria' },
	{ code: 'AZ', name: 'Azerbaijan' },
	{ code: 'BS', name: 'Bahamas' },
	{ code: 'BH', name: 'Bahrain' },
	{ code: 'BD', name: 'Bangladesh' },
	{ code: 'BB', name: 'Barbados' },
	{ code: 'BY', name: 'Belarus' },
	{ code: 'BE', name: 'Belgium' },
	{ code: 'BZ', name: 'Belize' },
	{ code: 'BJ', name: 'Benin' },
	{ code: 'BM', name: 'Bermuda' },
	{ code: 'BT', name: 'Bhutan' },
	{ code: 'BO', name: 'Bolivia, Plurinational State of' },
	{ code: 'BQ', name: 'Bonaire, Sint Eustatius and Saba' },
	{ code: 'BA', name: 'Bosnia and Herzegovina' },
	{ code: 'BW', name: 'Botswana' },
	{ code: 'BV', name: 'Bouvet Island' },
	{ code: 'BR', name: 'Brazil' },
	{ code: 'IO', name: 'British Indian Ocean Territory' },
	{ code: 'BN', name: 'Brunei Darussalam' },
	{ code: 'BG', name: 'Bulgaria' },
	{ code: 'BF', name: 'Burkina Faso' },
	{ code: 'BI', name: 'Burundi' },
	{ code: 'KH', name: 'Cambodia' },
	{ code: 'CM', name: 'Cameroon' },
	{ code: 'CA', name: 'Canada' },
	{ code: 'CV', name: 'Cape Verde' },
	{ code: 'KY', name: 'Cayman Islands' },
	{ code: 'CF', name: 'Central African Republic' },
	{ code: 'TD', name: 'Chad' },
	{ code: 'CL', name: 'Chile' },
	{ code: 'CN', name: 'China' },
	{ code: 'CX', name: 'Christmas Island' },
	{ code: 'CC', name: 'Cocos (Keeling) Islands' },
	{ code: 'CO', name: 'Colombia' },
	{ code: 'KM', name: 'Comoros' },
	{ code: 'CG', name: 'Congo' },
	{ code: 'CD', name: 'Congo, the Democratic Republic of the' },
	{ code: 'CK', name: 'Cook Islands' },
	{ code: 'CR', name: 'Costa Rica' },
	{ code: 'CI', name: 'Côte d\'Ivoire' },
	{ code: 'HR', name: 'Croatia' },
	{ code: 'CU', name: 'Cuba' },
	{ code: 'CW', name: 'Curaçao' },
	{ code: 'CY', name: 'Cyprus' },
	{ code: 'CZ', name: 'Czech Republic' },
	{ code: 'DK', name: 'Denmark' },
	{ code: 'DJ', name: 'Djibouti' },
	{ code: 'DM', name: 'Dominica' },
	{ code: 'DO', name: 'Dominican Republic' },
	{ code: 'EC', name: 'Ecuador' },
	{ code: 'EG', name: 'Egypt' },
	{ code: 'SV', name: 'El Salvador' },
	{ code: 'GQ', name: 'Equatorial Guinea' },
	{ code: 'ER', name: 'Eritrea' },
	{ code: 'EE', name: 'Estonia' },
	{ code: 'ET', name: 'Ethiopia' },
	{ code: 'FK', name: 'Falkland Islands (Malvinas)' },
	{ code: 'FO', name: 'Faroe Islands' },
	{ code: 'FJ', name: 'Fiji' },
	{ code: 'FI', name: 'Finland' },
	{ code: 'FR', name: 'France' },
	{ code: 'GF', name: 'French Guiana' },
	{ code: 'PF', name: 'French Polynesia' },
	{ code: 'TF', name: 'French Southern Territories' },
	{ code: 'GA', name: 'Gabon' },
	{ code: 'GM', name: 'Gambia' },
	{ code: 'GE', name: 'Georgia' },
	{ code: 'DE', name: 'Germany' },
	{ code: 'GH', name: 'Ghana' },
	{ code: 'GI', name: 'Gibraltar' },
	{ code: 'GR', name: 'Greece' },
	{ code: 'GL', name: 'Greenland' },
	{ code: 'GD', name: 'Grenada' },
	{ code: 'GP', name: 'Guadeloupe' },
	{ code: 'GU', name: 'Guam' },
	{ code: 'GT', name: 'Guatemala' },
	{ code: 'GG', name: 'Guernsey' },
	{ code: 'GN', name: 'Guinea' },
	{ code: 'GW', name: 'Guinea-Bissau' },
	{ code: 'GY', name: 'Guyana' },
	{ code: 'HT', name: 'Haiti' },
	{ code: 'HM', name: 'Heard Island and McDonald Islands' },
	{ code: 'VA', name: 'Holy See (Vatican City State)' },
	{ code: 'HN', name: 'Honduras' },
	{ code: 'HK', name: 'Hong Kong' },
	{ code: 'HU', name: 'Hungary' },
	{ code: 'IS', name: 'Iceland' },
	{ code: 'IN', name: 'India' },
	{ code: 'ID', name: 'Indonesia' },
	{ code: 'IR', name: 'Iran, Islamic Republic of' },
	{ code: 'IQ', name: 'Iraq' },
	{ code: 'IE', name: 'Ireland' },
	{ code: 'IM', name: 'Isle of Man' },
	{ code: 'IL', name: 'Israel' },
	{ code: 'IT', name: 'Italy' },
	{ code: 'JM', name: 'Jamaica' },
	{ code: 'JP', name: 'Japan' },
	{ code: 'JE', name: 'Jersey' },
	{ code: 'JO', name: 'Jordan' },
	{ code: 'KZ', name: 'Kazakhstan' },
	{ code: 'KE', name: 'Kenya' },
	{ code: 'KI', name: 'Kiribati' },
	{ code: 'KP', name: 'Korea, Democratic People\'s Republic of' },
	{ code: 'KR', name: 'Korea, Republic of' },
	{ code: 'KW', name: 'Kuwait' },
	{ code: 'KG', name: 'Kyrgyzstan' },
	{ code: 'LA', name: 'Lao People\'s Democratic Republic' },
	{ code: 'LV', name: 'Latvia' },
	{ code: 'LB', name: 'Lebanon' },
	{ code: 'LS', name: 'Lesotho' },
	{ code: 'LR', name: 'Liberia' },
	{ code: 'LY', name: 'Libya' },
	{ code: 'LI', name: 'Liechtenstein' },
	{ code: 'LT', name: 'Lithuania' },
	{ code: 'LU', name: 'Luxembourg' },
	{ code: 'MO', name: 'Macao' },
	{ code: 'MG', name: 'Madagascar' },
	{ code: 'MW', name: 'Malawi' },
	{ code: 'MY', name: 'Malaysia' },
	{ code: 'MV', name: 'Maldives' },
	{ code: 'ML', name: 'Mali' },
	{ code: 'MT', name: 'Malta' },
	{ code: 'MH', name: 'Marshall Islands' },
	{ code: 'MQ', name: 'Martinique' },
	{ code: 'MR', name: 'Mauritania' },
	{ code: 'MU', name: 'Mauritius' },
	{ code: 'YT', name: 'Mayotte' },
	{ code: 'MX', name: 'Mexico' },
	{ code: 'FM', name: 'Micronesia, Federated States of' },
	{ code: 'MD', name: 'Moldova, Republic of' },
	{ code: 'MC', name: 'Monaco' },
	{ code: 'MN', name: 'Mongolia' },
	{ code: 'ME', name: 'Montenegro' },
	{ code: 'MS', name: 'Montserrat' },
	{ code: 'MA', name: 'Morocco' },
	{ code: 'MZ', name: 'Mozambique' },
	{ code: 'MM', name: 'Myanmar' },
	{ code: 'NA', name: 'Namibia' },
	{ code: 'NR', name: 'Nauru' },
	{ code: 'NP', name: 'Nepal' },
	{ code: 'NL', name: 'Netherlands' },
	{ code: 'NC', name: 'New Caledonia' },
	{ code: 'NZ', name: 'New Zealand' },
	{ code: 'NI', name: 'Nicaragua' },
	{ code: 'NE', name: 'Niger' },
	{ code: 'NG', name: 'Nigeria' },
	{ code: 'NU', name: 'Niue' },
	{ code: 'NF', name: 'Norfolk Island' },
	{ code: 'MP', name: 'Northern Mariana Islands' },
	{ code: 'NO', name: 'Norway' },
	{ code: 'OM', name: 'Oman' },
	{ code: 'PK', name: 'Pakistan' },
	{ code: 'PW', name: 'Palau' },
	{ code: 'PS', name: 'Palestinian Territory, Occupied' },
	{ code: 'PA', name: 'Panama' },
	{ code: 'PG', name: 'Papua New Guinea' },
	{ code: 'PY', name: 'Paraguay' },
	{ code: 'PE', name: 'Peru' },
	{ code: 'PH', name: 'Philippines' },
	{ code: 'PN', name: 'Pitcairn' },
	{ code: 'PL', name: 'Poland' },
	{ code: 'PT', name: 'Portugal' },
	{ code: 'PR', name: 'Puerto Rico' },
	{ code: 'QA', name: 'Qatar' },
	{ code: 'RE', name: 'Réunion' },
	{ code: 'RO', name: 'Romania' },
	{ code: 'RU', name: 'Russian Federation' },
	{ code: 'RW', name: 'Rwanda' },
	{ code: 'BL', name: 'Saint Barthélemy' },
	{ code: 'SH', name: 'Saint Helena, Ascension and Tristan da Cunha' },
	{ code: 'KN', name: 'Saint Kitts and Nevis' },
	{ code: 'LC', name: 'Saint Lucia' },
	{ code: 'MF', name: 'Saint Martin (French part)' },
	{ code: 'PM', name: 'Saint Pierre and Miquelon' },
	{ code: 'VC', name: 'Saint Vincent and the Grenadines' },
	{ code: 'WS', name: 'Samoa' },
	{ code: 'SM', name: 'San Marino' },
	{ code: 'ST', name: 'Sao Tome and Principe' },
	{ code: 'SA', name: 'Saudi Arabia' },
	{ code: 'SN', name: 'Senegal' },
	{ code: 'RS', name: 'Serbia' },
	{ code: 'SC', name: 'Seychelles' },
	{ code: 'SL', name: 'Sierra Leone' },
	{ code: 'SG', name: 'Singapore' },
	{ code: 'SX', name: 'Sint Maarten (Dutch part)' },
	{ code: 'SK', name: 'Slovakia' },
	{ code: 'SI', name: 'Slovenia' },
	{ code: 'SB', name: 'Solomon Islands' },
	{ code: 'SO', name: 'Somalia' },
	{ code: 'ZA', name: 'South Africa' },
	{ code: 'GS', name: 'South Georgia and the South Sandwich Islands' },
	{ code: 'SS', name: 'South Sudan' },
	{ code: 'ES', name: 'Spain' },
	{ code: 'LK', name: 'Sri Lanka' },
	{ code: 'SD', name: 'Sudan' },
	{ code: 'SR', name: 'Suriname' },
	{ code: 'SJ', name: 'Svalbard and Jan Mayen' },
	{ code: 'SZ', name: 'Swaziland' },
	{ code: 'SE', name: 'Sweden' },
	{ code: 'CH', name: 'Switzerland' },
	{ code: 'SY', name: 'Syrian Arab Republic' },
	{ code: 'TW', name: 'Taiwan, Province of China' },
	{ code: 'TJ', name: 'Tajikistan' },
	{ code: 'TZ', name: 'Tanzania, United Republic of' },
	{ code: 'TH', name: 'Thailand' },
	{ code: 'TL', name: 'Timor-Leste' },
	{ code: 'TG', name: 'Togo' },
	{ code: 'TK', name: 'Tokelau' },
	{ code: 'TO', name: 'Tonga' },
	{ code: 'TT', name: 'Trinidad and Tobago' },
	{ code: 'TN', name: 'Tunisia' },
	{ code: 'TR', name: 'Turkey' },
	{ code: 'TM', name: 'Turkmenistan' },
	{ code: 'TC', name: 'Turks and Caicos Islands' },
	{ code: 'TV', name: 'Tuvalu' },
	{ code: 'UG', name: 'Uganda' },
	{ code: 'UA', name: 'Ukraine' },
	{ code: 'AE', name: 'United Arab Emirates' },
	{ code: 'GB', name: 'United Kingdom' },
	{ code: 'US', name: 'United States' },
	{ code: 'UM', name: 'United States Minor Outlying Islands' },
	{ code: 'UY', name: 'Uruguay' },
	{ code: 'UZ', name: 'Uzbekistan' },
	{ code: 'VU', name: 'Vanuatu' },
	{ code: 'VE', name: 'Venezuela, Bolivarian Republic of' },
	{ code: 'VN', name: 'Viet Nam' },
	{ code: 'VG', name: 'Virgin Islands, British' },
	{ code: 'VI', name: 'Virgin Islands, U.S.' },
	{ code: 'WF', name: 'Wallis and Futuna' },
	{ code: 'EH', name: 'Western Sahara' },
	{ code: 'YE', name: 'Yemen' },
	{ code: 'ZM', name: 'Zambia' },
	{ code: 'ZW', name: 'Zimbabwe' }
];

export const calculateTotalPostage = (basket, selectedCountry) => {
	if (!basket || !basket.products) return 0;

	let continentKey = "other";

	// Determine which continent the selected country belongs to
	for (const [key, countries] of Object.entries(countriesByContinent)) {
		if (countries.includes(selectedCountry?.code)) {
			continentKey = key;
			break;
		}
	}

	// Determine the correct postage price key based on the continent
	const postageKey = `postage_price_${continentKey}`;

	// Find the maximum postage price in the basket based on the selected country
	return basket.products.reduce((maxPrice, product) => {
		const price = product[postageKey] || 0;
		return Math.max(maxPrice, price);
	}, 0);
};


export const calculateOriginalTotalPrice = (basket) => {
	if (!basket || !basket.products) return 0;
	return basket.products.reduce((total, product) => total + product.quantity * (product.price || 0), 0);
};

export const calculateDiscountedTotalPrice = (basket, discountPercentage) => {
	const originalTotalPrice = calculateOriginalTotalPrice(basket);
	const discountFactor = 1 - discountPercentage / 100;
	return originalTotalPrice * discountFactor;
};


export const sliceStyle = (object) => {
	const customStyles = {};

	if (object?.top_margin) {
		customStyles.marginTop = object?.top_margin === 'None' ? 0 :
			object?.top_margin === 'Small' ? '1rem' :
				object?.top_margin === 'Medium' ? '2.5rem' :
					object?.top_margin === 'Large' ? '5rem' : '0';
	}

	if (object?.bottom_margin) {
		customStyles.marginBottom = object?.bottom_margin === 'None' ? 0 :
			object?.bottom_margin === 'Small' ? '1rem' :
				object?.bottom_margin === 'Medium' ? '2.5rem' :
					object?.bottom_margin === 'Large' ? '5rem' : '0';
	}

	if (object?.bottom_padding) {
		customStyles.paddingBottom = object?.bottom_padding === 'None' ? 0 :
			object?.bottom_padding === 'Small' ? '2rem' :
				object?.bottom_padding === 'Medium' ? '4rem' :
					object?.bottom_padding === 'Large' ? '6rem' :
						'0';
	}

	if (object?.top_padding) {
		customStyles.paddingTop = object?.top_padding === 'None' ? 0 :
			object?.top_padding === 'Small' ? '2rem' :
				object?.top_padding === 'Medium' ? '4rem' :
					object?.top_padding === 'Large' ? '6rem' :
						'0';
	}

	if (object?.background_colour) {
		customStyles.backgroundColor = object?.background_colour;
	}

	return customStyles;
};

export const dashify = (text, options = {}) => {
	const separator = options.separator === '_' ? '_' : '-';

	if (typeof text === 'string') {
		return text.trim()
			.replace(/&/g, 'and')
			.replace(/([a-z])([A-Z])/g, `$1${separator}$2`)
			.replace(/\W/g, m => /[À-ž]/.test(m) ? m : separator)
			.replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '')
			.replace(new RegExp(`${separator}{2,}`, 'g'), m => options && options.condense ? separator : m);
	}
}

/**
 * FetchLinks configuration for Prismic queries
 * These can be reused across different document types
 */

// Product fields to fetch when linked from other documents
const productFields = [
	'product.category',
	'product.title',
	'product.price',
	'product.active',
	'product.variations',
	'product.gallery',
];

// Product category fields to fetch when linked
const productCategoryFields = [
	'product_category.name',
	'product_category.plural_url',
	'product_category.price',
	'product_category.postage_price_uk',
	'product_category.postage_price_eu',
	'product_category.postage_price_na',
	'product_category.postage_price_sa',
	'product_category.postage_price_af',
	'product_category.postage_price_as',
	'product_category.postage_price_oc',
	'product_category.postage_price_other',
	'product_category.slices',
];

export const fetchLinksConfig = {
	// Product fields to fetch when linked from other documents
	product: productFields,

	// Product category fields to fetch when linked
	productCategory: productCategoryFields,

	// Combined fetchLinks for pages (includes products and categories)
	page: [
		...productFields,
		'product_category.name',
		'product_category.plural_url',
		'product_category.price',
		'product_category.data',
	],

	// FetchLinks for product documents (includes categories)
	productDocument: productCategoryFields,

	// FetchLinks for product category documents (includes products and categories, similar to pages)
	productCategory: [
		...productFields,
		'product_category.name',
		'product_category.plural_url',
		'product_category.price',
		'product_category.data',
	],
};

/**
 * Fetches page data from Prismic based on route parameters
 * @param {Object} params - Route parameters
 * @returns {Promise<Object>} Object containing page, category, product, and post data
 */
export async function getPageData(params) {
	const client = createClient();
	let page, category, product, post;

	// Debug: log what route we're trying to resolve
	const routePath = params?.page ? `/${params.page.join('/')}` : '/';

	// Skip Next.js internal routes and static files
	if (routePath.startsWith('/_next/') ||
		routePath.startsWith('/.well-known/') ||
		routePath.startsWith('/favicon') ||
		routePath.startsWith('/robots.txt') ||
		routePath.startsWith('/sitemap.xml')) {
		// Return empty data for internal routes - Next.js will handle them
		return {
			page: null,
			category: null,
			product: null,
			post: null
		};
	}

	try {
		// Check if this is a post route (/inspiration/:uid)
		if (params?.page?.[0] === 'inspiration' && params?.page?.[1]) {
			try {
				post = await client.getByUID("post", params?.page?.[1], {
					fetchLinks: fetchLinksConfig.post,
				});
			} catch (e) {
				console.error('Error fetching post:', e);
			}
		}

		// Check if this is a product route (/:category/:uid)
		if (params?.page?.length > 1 && !post) {
			try {
				// Try to get category by uid first
				try {
					category = await client.getByUID("product_category", params?.page?.[0]);
				} catch (e) {
					// If not found by uid, try plural_url field
					const categories = await client.getAllByType("product_category", {
						filters: [
							prismic.filter.at("my.product_category.plural_url", params?.page?.[0])
						],
						limit: 1
					});
					if (categories.length > 0) {
						category = categories[0];
					}
				}
				// Fetch product (don't fetch category slices for product routes)
				if (category) {
					product = await client.getByUID("product", params?.page?.[1], {
						fetchLinks: fetchLinksConfig.productDocument,
					});
				}
			} catch (e) {
				console.error('Error fetching product:', e);
			}
		}

		// Check if this is a product category route (single segment, not post or product)
		if (params?.page?.length === 1 && !post && !product) {
			try {
				// Try to get category by uid first
				category = await client.getByUID("product_category", params?.page?.[0], {
					fetchLinks: fetchLinksConfig.productCategory,
				});
			} catch (e) {
				// If not found by uid, try plural_url field
				try {
					const categories = await client.getAllByType("product_category", {
						filters: [
							prismic.filter.at("my.product_category.plural_url", params?.page?.[0])
						],
						limit: 1,
						fetchLinks: fetchLinksConfig.productCategory,
					});
					if (categories.length > 0) {
						category = categories[0];
					}
				} catch (e2) {
					// Not a product category, will try page next
				}
			}
		}

		// Try to get page if not post, product, or product category
		if (!post && !product && !category) {
			try {
				page = await client.getByUID("page", params?.page?.[0] ?? 'homepage', {
					fetchLinks: fetchLinksConfig.page,
				});
			} catch (e) {
				console.error('Error fetching page:', e);
			}
		}

		// Fallback to 404 page
		if (!page && !category && !product && !post) {
			// Debug: log which route couldn't be found
			console.log(`[getPageData] No content found for route: ${routePath} - attempting 404 fallback`);
			try {
				page = await client.getByUID("page", '404');
			} catch (e) {
				// 404 page doesn't exist in Prismic - this is expected if not set up
				// Log the route that triggered this for debugging
				if (e.name === 'NotFoundError') {
					console.log(`[getPageData] 404 page not found in Prismic for route: ${routePath} (this is OK if you haven't created a 404 page)`);
				} else {
					console.error('Error fetching 404 page:', e);
				}
			}
		}

		// If we have a product, don't include category slices (category is only for navigation/metadata)
		// Clear category slices if this is a product route
		if (product && category && category.data) {
			// Create a copy without slices to prevent rendering category slices on product pages
			category = {
				...category,
				data: {
					...category.data,
					slices: undefined
				}
			};
		}

		return {
			page: page,
			category: category,
			product: product,
			post: post
		};

	} catch (e) {
		console.error('Error in getPageData:', e);
		return {
			page: null,
			category: null,
			product: null,
			post: null
		};
	}
}
