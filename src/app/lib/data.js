import { createClient } from '@/prismicio';
import { fetchLinksConfig } from '@/app/lib/utils';

export async function getMenuData() {
	try {
		const client = createClient();
		return await client.getSingle('menu', {
			fetchLinks: [
				'product_category.uid',
				'product_category.plural_url',
			],
		});
	} catch (error) {
		console.error('Error fetching menu data', error);
		return null;
	}
}
