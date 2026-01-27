"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Settings } from '@/app/lib/settings';

const BasketContext = createContext();

export const useBasket = () => {
    return useContext(BasketContext);
};

export const BasketProvider = ({ children }) => {
    const [basket, setBasket] = useState(null);

    // Load basket from cookies on mount
    useEffect(() => {
        const storedBasket = Cookies.get(Settings.cookieName);
        const parsedBasket = storedBasket ? JSON.parse(storedBasket) : null;
        setBasket(parsedBasket);
    }, []);

    return (
        <BasketContext.Provider value={{ basket, setBasket }}>
            {children}
        </BasketContext.Provider>
    );
};
