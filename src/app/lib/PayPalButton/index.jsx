"use client";

import React from 'react';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

export function PayPalButton({ formData, basket, onApprovedPurchase }) {
  const [{ isPending }] = usePayPalScriptReducer();

  const createOrder = async () => {
    try {

      const response = await fetch('/api/order/create', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: formData,
          basket: basket
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const order = await response.json();
      return order.id;

    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const onApprove = async () => {
    try {

      // const response = await fetch('/api/order/capture', {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     orderID: approveData.orderID,
      //   })
      // });

      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }

      onApprovedPurchase();

    } catch (error) {
      console.error('Error approving order:', error);
    }
  };

  // Handle the loading state
  if (isPending) {
    return "Loading...";
  }

  return (
      <PayPalButtons 
        style={{ layout: "horizontal", shape: 'pill' }}
        forceReRender={[formData, basket]}
        createOrder={createOrder}
        onApprove={onApprove}
      />
  );
}
