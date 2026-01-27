export const Settings = {
	cookieName: 'mybooknook',

	meta: {
		title: 'My Book Nook',
		description: 'Discover the magic of miniature worlds with My Book Nook. Shop our curated range of premium DIY book nook kits and 3D bookshelf inserts. Perfect for gifts or your own creative escape.',
		image: process.env.NEXT_PUBLIC_METADATA_BASE ? `${process.env.NEXT_PUBLIC_METADATA_BASE}/og.png` : '/og.png',
	},

	inspirationPrefix: '/blog',

}