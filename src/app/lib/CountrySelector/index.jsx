"use client";

import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import Cookies from 'js-cookie';
import { Settings } from '@/app/lib/settings';
import { toast } from 'react-toastify';
import { countries } from '@/app/lib/utils';
import styles from './countrySelector.module.css';

export const CountrySelector = ({ onCountrySelected, sansButton = false }) => {
    const [country, setCountry] = useState();
    const dropdownRef = useRef();

    useEffect(() => {
        const storedBasket = Cookies.get(Settings.cookieName);
        const parsedBasket = storedBasket ? JSON.parse(storedBasket) : null;

        if (parsedBasket?.country?.code) {
            setCountry(parsedBasket.country);
        }
    }, []);

    const handleCountryChange = () => {
        const selectedValue = dropdownRef.current.value;

        if (selectedValue === 'outer-space') {
            toast.error(`Please select your country`);
            return;
        }

        toast.dismiss();

        const selectedText = dropdownRef.current.options[dropdownRef.current.selectedIndex].text;

        const country = {
            code: selectedValue,
            name: selectedText,
        };
        
        setCountry(country);
        onCountrySelected(country);
    };

    const handleSoftChange = (event) => {
        const selectedOption = event.target.options[event.target.selectedIndex];
        const country = {
            code: selectedOption.value,
            name: selectedOption.text,
        };
        
        setCountry(country);
        if (sansButton) onCountrySelected(country);
    };

    return (
        <div className={styles.container}>
            <div className={clsx(styles.inputWrap, !sansButton && styles.withButton)}>
                <select className={styles.select} id="country-select" value={country?.code} onChange={handleSoftChange} ref={dropdownRef}>
                    <option disabled value="outer-space">&nbsp;</option>
                    <option value="GB">United Kingdom</option>
                    <option value="FR">France</option>
                    <option value="ES">Spain</option>
                    <option value="RS">Serbia</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="US">United States of America</option>
                    <option disabled className={"separator"}></option>
                    { countries.map((country) => (
                        <option key={country.code} value={country.code}>
                            {country.name}
                        </option>
                    ))}                    
                </select>
            </div>
            
            {!sansButton && (
                <button className={styles.button} onClick={handleCountryChange}>
                    Set
                </button>
            )}
        </div>
    );
};
