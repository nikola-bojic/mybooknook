import nodemailer from 'nodemailer';

/**
 * Creates and returns a configured nodemailer transporter for Zoho Mail
 * Uses MAIL_USER and MAIL_PASSWORD environment variables
 * @returns {import('nodemailer').Transporter}
 */
export function createEmailTransporter() {
	const user = process.env.MAIL_USER;
	const pass = process.env.MAIL_PASSWORD;

	if (!user?.trim() || !pass?.trim()) {
		throw new Error('MAIL_USER and MAIL_PASSWORD must be set in environment variables');
	}

	return nodemailer.createTransport({
		host: 'smtppro.zoho.eu',
		port: 465,
		secure: true,
		auth: {
			user,
			pass,
		},
	});
}

/**
 * Gets the email address from environment variables
 * @returns {string} The email address to use for from/to fields
 */
export function getMailUser() {
	const user = process.env.MAIL_USER;
	if (!user?.trim()) {
		throw new Error('MAIL_USER must be set in environment variables');
	}
	return user;
}
