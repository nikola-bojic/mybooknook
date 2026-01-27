import fs from 'fs';
import path from 'path';
import { countries } from '@/app/lib/utils';
import { createEmailTransporter, getMailUser } from '@/app/lib/emailUtils';

const getCountryName = (countryCode) => {
	const country = countries.find((c) => c.code === countryCode);
	return country ? country.name : 'N/A';
};

export const sendOrderEmails = async (orderData) => {
	try {
		// init email
		const transporter = createEmailTransporter();
		const mailUser = getMailUser();

		// Load the HTML template
		const templatePath = path.join(process.cwd(), 'src/assets/email-templates/order-template.html');
		let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

		// Format shipping address
		const shippingAddress = [
			orderData?.purchase_units[0].custom_id,
			orderData?.purchase_units[0]?.shipping?.address?.address_line_1,
			orderData?.purchase_units[0]?.shipping?.address?.admin_area_2,
			orderData?.purchase_units[0]?.shipping?.address?.admin_area_1,
			orderData?.purchase_units[0]?.shipping?.address?.postal_code,
			getCountryName(orderData?.purchase_units[0]?.shipping?.address?.country_code)
		]
			.filter(Boolean)
			.join('<br/>');

		// format totals
		const itemTotal = parseFloat(orderData?.purchase_units[0]?.amount?.breakdown?.item_total?.value) || 0;
		const shippingCost = parseFloat(orderData?.purchase_units[0]?.amount?.breakdown?.shipping?.value) || 0;
		const discount = parseFloat(orderData?.purchase_units[0]?.amount?.breakdown?.discount?.value) || 0;
		const total = (itemTotal + shippingCost - discount).toFixed(2);

		// format customer email
		const customerEmail = orderData?.purchase_units[0].invoice_id.split('::')[0];

		// Replace placeholders in the template with actual data
		const sharedEmailHtml = htmlTemplate
			.replace('{{shipping_address}}', shippingAddress)
			.replace('{{order_id}}', orderData?.id)
			.replace('{{item_total}}', itemTotal.toFixed(2))
			.replace('{{total}}', total)
			.replace('{{shipping_cost}}', shippingCost.toFixed(2))
			.replace('{{discount}}', discount ? `<span><strong>Discount:</strong> £${discount.toFixed(2)}</span>` : ``)
			.replace('{{items}}', orderData?.purchase_units[0]?.items.map(item => {

				const description = JSON.parse(item.description);
				const descriptionElements = Object.entries(description).map(([key, value]) => `<p>${key}: ${value}</p>`).join('');

				return `
                    <tr>
                        <td style="width: 100px">
                            <img src="${item.image_url.replace('png', 'webp')}" alt="${item.name}"/>
                        </td>
                        <td>
                            <h4><a href="${item.url}" target="_blank">${item.name}</a></h4>
                            ${descriptionElements}
                        </td>
                        <td>${item.quantity}</td>
                        <td>£${(item.unit_amount.value * item.quantity).toFixed(2)}</td>
                    </tr>
                `;
			}).join(''));

		// email to customer data
		const customerEmailHtml = sharedEmailHtml
			.replace('{{header}}', `Thank you for your order, ${orderData?.purchase_units[0].custom_id}`)
			.replace('{{shipping_header}}', `We will send your order to:`)
			.replace('{{message}}', ``)
			.replace('{{customer_email}}', ``)

		// email to admin data
		const adminEmailHtml = sharedEmailHtml
			.replace('{{header}}', `Congratulation, you have new order from ${orderData?.purchase_units[0].custom_id}`)
			.replace('{{shipping_header}}', `Send to:`)
			.replace('{{message}}', `<h3>Message:</h3><p>${orderData?.purchase_units[0].description ? orderData?.purchase_units[0].description : 'N/A'}</p><br/>`)
			.replace('{{customer_email}}', `<p>${customerEmail}</p><br/>`)

		// send admin email
		await transporter.sendMail({
			from: `"My Book Nook" <${mailUser}>`,
			to: mailUser,
			subject: `New Order - ${orderData?.purchase_units[0].custom_id}`,
			html: adminEmailHtml
		});

		// send customer email
		await transporter.sendMail({
			from: `"My Book Nook" <${mailUser}>`,
			to: customerEmail,
			subject: `Thank you for your order`,
			html: customerEmailHtml
		});

	} catch (error) {
		console.error('Error sending email:', error);
		throw new Error('Email sending failed');
	}
};
