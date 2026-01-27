import { sendOrderEmails } from '../orderUtils';

export async function POST(request, res) {
    const { orderID } = await request.json();

    try {

        const response = await fetch(`${process.env.PAYPAL_ENDPOINT}/v2/checkout/orders/${orderID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${Buffer.from(process.env.PAYPAL_ACCESS_TOKEN).toString('base64')}`,
            }
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const orderData = await response.json();
        
        console.log('Approved order JSON data:', JSON.stringify(orderData));
  
        try {
            const captureResponse = await fetch(`${process.env.PAYPAL_ENDPOINT}/v2/checkout/orders/${orderID}/capture`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${Buffer.from(process.env.PAYPAL_ACCESS_TOKEN).toString('base64')}`
                }
            });
        
            if (!captureResponse.ok) {
                // Extract the error details from the response if available
                const errorData = await captureResponse.json();
                console.error('Capture payment failed:', {
                    status: captureResponse.status,
                    statusText: captureResponse.statusText,
                    body: errorData
                });
                throw new Error(`Failed to capture payment. Status: ${captureResponse.status}`);
            }
        
            const captureData = await captureResponse.json();
            console.log('Payment captured successfully:', captureData);
        
            // Send emails after capturing payment
            await sendOrderEmails(orderData);
        
            return new Response('OK', {
                status: 200,
            });
        
        } catch (error) {
            console.error('Error capturing payment:', error.message || error);
        
            return new Response(`Error capturing payment: ${error.message || error}`, {
                status: 500,
            });
        }

    } catch (error) {
        console.error('Error capturing payment:', error);

        return new Response('Oops', {
            status: 500,
        });
    }

  }