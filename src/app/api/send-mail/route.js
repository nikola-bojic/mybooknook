import { createEmailTransporter, getMailUser } from '@/app/lib/emailUtils';

export async function POST(request, res) {
	const { name, email, message } = await request.json();

	try {
		const transporter = createEmailTransporter();
		const mailUser = getMailUser();

		const mailOptions = {
			from: `"My Book Nook" <${mailUser}>`,
			to: mailUser,
			subject: 'New Enquiry',
			text: `Name: ${name}\nEmail: ${email}\n\nMessage: ${message}`,
		};

		await transporter.sendMail(mailOptions);
		return new Response('OK', {
			status: 200,
		});

	} catch (error) {
		console.error('Error sending email:', error);
		return new Response('Oops', {
			status: 500,
		});
	}
}
