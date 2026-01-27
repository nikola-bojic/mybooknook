import { createClient } from '@/prismicio';

const verifyDiscountCode = (allDiscountCodes, code) => {
    if (!allDiscountCodes || !allDiscountCodes.data?.code) return null;
    const currentDate = new Date();
    const enteredCode = code.toUpperCase();

    for (const discountCode of allDiscountCodes.data.code) {
        
        if (discountCode.active && discountCode.code === enteredCode) {
            const startDate = discountCode.start_date ? new Date(discountCode.start_date) : null;
            const endDate = discountCode.expiry_date ? new Date(discountCode.expiry_date) : null;

            const isStartDateValid = startDate ? currentDate >= startDate : true;
            const isEndDateValid = endDate ? currentDate <= endDate : true;

            if (isStartDateValid && isEndDateValid) {
                return {
                    discount: discountCode.percentage_off,
                    code: discountCode.code
                };
            }
        }
    }

    return null;
};

export async function POST(request) {
    const { code } = await request.json();

    const client = createClient();

    try {

        const allDiscountCodes = await client.getSingle('discount_codes');
        const discountDetails = verifyDiscountCode(allDiscountCodes, code);

        if (discountDetails) {
            return new Response(JSON.stringify({ code: code, discount: discountDetails.discount }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } else {
            return new Response('Invalid or expired discount code', {
                status: 404,
            });
        }

    } catch (error) {
        console.log('Error', error);
        return new Response('Oops', {
            status: 500,
        });
    }
}
