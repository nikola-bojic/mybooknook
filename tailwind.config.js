/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/slices/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/lib/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				'branded-purple': '#7e7ee8',
				'branded-pink': '#f7750b',
				// 'branded-pink': '#ed56df',
			},
			fontFamily: {
				'heading': ['var(--font-poetsen-one)'],
			},
		},
	},
	plugins: [],
}
