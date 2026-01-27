"use client";

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { Settings } from '@/app/lib/settings';
import IconLoader from '@/assets/icons/icon-loader.svg';
import styles from './discountCode.module.css';

export const DiscountCode = ({ onDiscountVerified }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState(null);
    const [isAccepted, setIsAccepted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const storedBasket = Cookies.get(Settings.cookieName);
        const parsedBasket = storedBasket ? JSON.parse(storedBasket) : null;

        if (parsedBasket?.discount?.code) {
            setCode(parsedBasket.discount.code);
            setIsAccepted(true);
        }
    }, []);

    const handleCodeChange = (event) => {
        setCode(event.target.value);
    };

    const verifyDiscountCode = async () => {
        setIsLoading(true);

        if (!code) {
            setError(null);
            onDiscountVerified({ code: null, discount: 0 });
            setIsLoading(false);
            setIsAccepted(false);
            return;
        }

        try {
            const response = await fetch('/api/verify-discount-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });

            if (response.ok) {
                const data = await response.json();

                if (data.discount) {
                    setError(null);
                    setIsAccepted(true);
                    onDiscountVerified({ code: code, discount: data.discount });
                    
                    toast.success(`The discount code was applied`);

                    const storedBasket = Cookies.get(Settings.cookieName);
                    const parsedBasket = storedBasket ? JSON.parse(storedBasket) : {};
                    parsedBasket.discount = { code: code, discount: data.discount };
                    Cookies.set(Settings.cookieName, JSON.stringify(parsedBasket), { expires: 7 });

                } else {
                    setError('Invalid discount code');
                    onDiscountVerified({ code: code, discount: 0 });
                }
            } else {
                setError('Failed to verify discount code');
                onDiscountVerified({ code: code, discount: 0 });
            }
        } catch (error) {
            setError('Failed to verify discount code');
            onDiscountVerified({ code: code, discount: 0 });
        
        } finally {
            
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <label className={styles.label} htmlFor="discount_code">
                Do you have a discount code?
            </label>

            <div className={styles.inputContainer}>
                <div className={clsx(styles.inputWrap, error && styles.error, isAccepted && !error && styles.valid)}>
                    <input
                        className={styles.input}
                        type="text"
                        tabIndex={20}
                        id="discount_code"
                        name="discount_code"
                        value={code}
                        onChange={handleCodeChange}
                    />
                    <span className="icon" />
                </div>

                <span className={styles.button} tabIndex={21} onClick={verifyDiscountCode}>
                  {isLoading ? <IconLoader /> : <React.Fragment>Verify</React.Fragment>}
                </span>

            </div>
        </div>
    );
};
