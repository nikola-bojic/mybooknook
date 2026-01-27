import { sendOrderEmails } from '../orderUtils';

export async function POST(request) {
    try {
        const webhookData = await request.json();
        console.log('Webhook data received from PayPal:', JSON.stringify(webhookData));

        if (webhookData.event_type === 'CHECKOUT.ORDER.APPROVED') {
            const orderID = webhookData.resource.id;
            console.log(`Order Completed. Order ID: ${orderID}`);

            try {

                const response = await fetch(`${process.env.PAYPAL_ENDPOINT}/v2/checkout/orders/${orderID}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Basic ${Buffer.from(process.env.PAYPAL_ACCESS_TOKEN).toString('base64')}`,
                    }
                });
          
                if (!response.ok) {
                    // Extract the error details from the response if available
                    const errorData = await response.json();
                    console.error('Order failed:', {
                        status: response.status,
                        statusText: response.statusText,
                        body: errorData
                    });
                    throw new Error(`Failed to create order. Status: ${response.status}`);
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
                    // await sendOrderEmails(orderData);
                
                    return new Response('OK', {
                        status: 200,
                    });
                
                } catch (error) {
                    console.error('Error capturing payment:', error.message || error);
                
                    // return new Response(`Error capturing payment: ${error.message || error}`, {
                    //     status: 500,
                    // });

                    return new Response('OK', {
                        status: 200,
                    });
                }
        
            } catch (error) {
                console.error('Error creating order:', error.message || error);
            
                // return new Response(`Error creating order: ${error.message || error}`, {
                //     status: 500,
                // });

                return new Response('OK', {
                    status: 200,
                });
            }

        } else if (webhookData.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
            const orderID = webhookData.resource.supplementary_data.related_ids.order_id;
            console.log(`Payment Completed. Order ID: ${orderID}`);

            try {

                const response = await fetch(`${process.env.PAYPAL_ENDPOINT}/v2/checkout/orders/${orderID}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Basic ${Buffer.from(process.env.PAYPAL_ACCESS_TOKEN).toString('base64')}`,
                    }
                });
          
                if (!response.ok) {
                    // Extract the error details from the response if available
                    const errorData = await response.json();
                    console.error('Order failed:', {
                        status: response.status,
                        statusText: response.statusText,
                        body: errorData
                    });
                    throw new Error(`Failed to create order. Status: ${response.status}`);
                }
          
                const orderData = await response.json();
                console.log('Approved order JSON data:', JSON.stringify(orderData));
          
                // Send emails after capturing payment
                await sendOrderEmails(orderData);
                
                return new Response('OK', {
                    status: 200,
                });
        
            } catch (error) {
                console.error('Error creating order:', error.message || error);
            
                // return new Response(`Error creating order: ${error.message || error}`, {
                //     status: 500,
                // });

                return new Response('OK', {
                    status: 200,
                });
            }

        } else {
            console.log('Event is not related to order completion');
            return new Response('Webhook event not processed', { status: 200 });

        }

    } catch (error) {
        console.error('Error processing PayPal webhook:', error);
        // return new Response('Error processing webhook', { status: 500 });

        return new Response('OK', {
            status: 200,
        });
    }
}