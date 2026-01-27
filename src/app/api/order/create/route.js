import { calculateTotalPostage, calculateOriginalTotalPrice, calculateDiscountedTotalPrice } from '@/app/lib/utils';
import { format } from 'date-fns';

const UK_COUNTRY_CODE = 'GB';

export async function POST(request, res) {
	const { customer, basket } = await request.json();

	// Enforce UK-only: reject non-UK addresses
	const countryCode = customer?.country_code || basket?.country?.code;
	if (countryCode && countryCode !== UK_COUNTRY_CODE) {
		return new Response(
			JSON.stringify({ error: 'We currently only deliver to UK addresses.' }),
			{ status: 400, headers: { 'Content-Type': 'application/json' } }
		);
	}

	let timestamp = format(new Date(), 'dd:MM:yyyy:HH:mm:ss');

	let totalOriginalPrice = 0;
	let totalDiscountedPrice = 0;
	let totalPostage = 0;
	let total = 0;

	try {

		if (basket) {
			totalOriginalPrice = calculateOriginalTotalPrice(basket);
			totalDiscountedPrice = calculateDiscountedTotalPrice(basket, basket?.discount?.discount ?? 0);
			totalPostage = calculateTotalPostage(basket, basket?.country);
			total = totalDiscountedPrice + totalPostage;
		}

		let formattedItems = [];
		basket?.products?.map(item => {
			formattedItems.push({
				name: item?.title,
				quantity: item?.quantity,
				sku: item?.sku,
				url: process.env.NEXT_PUBLIC_METADATA_BASE + item?.url,
				description: 'Book Nook',
				image_url: item?.image?.url.replace('webp', 'png').split('.png')[0] + '.png',
				unit_amount: {
					currency_code: 'GBP',
					value: item?.price
				}
			})
		})

		const body = {
			intent: "CAPTURE",
			purchase_units: [
				{
					amount: {
						currency_code: "GBP",
						value: total.toFixed(2),
						breakdown: {
							item_total: {
								currency_code: "GBP",
								value: totalOriginalPrice?.toFixed(2),
							},
							shipping: {
								currency_code: "GBP",
								value: totalPostage.toFixed(2),
							},
							discount: {
								currency_code: "GBP",
								value: (totalOriginalPrice - totalDiscountedPrice).toFixed(2),
							}
						}
					},
					custom_id: customer?.name,
					invoice_id: `${customer?.email}::${timestamp}`,
					description: 'Book Nook',
					items: formattedItems,
					shipping: {
						name: {
							customer: customer?.name
						},
						address: {
							address_line_1: customer?.address_line_1,
							admin_area_2: customer?.address_line_2,
							admin_area_1: customer?.address_line_3,
							postal_code: customer?.postcode,
							// country_code: customer?.country_code
							country_code: 'GB'
						}
					}
				}
			],
			payment_source: {
				paypal: {
					experience_context: {
						payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
						brand_name: "My Book Nook",
						shipping_preference: "SET_PROVIDED_ADDRESS"
					}
				}
			}
		};

		const response = await fetch(`${process.env.PAYPAL_ENDPOINT}/v2/checkout/orders`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Basic ${Buffer.from(process.env.PAYPAL_ACCESS_TOKEN).toString('base64')}`,
			},
			body: JSON.stringify(body)
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const order = await response.json();
		return new Response(JSON.stringify(order), {
			status: 200,
		});

	} catch (error) {
		console.error('Error creating order:', error);
	}
}