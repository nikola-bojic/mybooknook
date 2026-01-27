"use client";

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import clsx from 'clsx';
import { Settings } from '@/app/lib/settings';
import styles from './cookie.module.css';

export function CookieWarning() {
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        const storedBasket = Cookies.get(Settings.cookieName);
        const parsedBasket = storedBasket ? JSON.parse(storedBasket) : null;

        if (!parsedBasket?.cookieAccepted) {
            setShowWarning(true);
        }
    }, []);

    const handleOkClick = () => {
        let storedBasket = Cookies.get(Settings.cookieName);
        let parsedBasket = storedBasket ? JSON.parse(storedBasket) : {};
        
        parsedBasket.cookieAccepted = true;
        Cookies.set(Settings.cookieName, JSON.stringify(parsedBasket), { expires: 7 });

        setShowWarning(false);
    };

    if (!showWarning) {
        return null;
    }

    return (
        <div className={styles.wrapper}>
          <p className={styles.message}>We use cookies to enhance your experience. By continuing to use our website, you agree to our use of cookies.</p>
          <button className={styles.button} onClick={handleOkClick}>
              OK
          </button>
        </div>
    );
}
