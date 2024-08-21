import React, { useState, useEffect } from 'react';
import api from '../api';

import { Dropdown, DropdownButton, FormCheck } from 'react-bootstrap';

function PeriodSelector({ onPeriodChange }) {
    const [periods, setPeriods] = useState([]);
    const [localSelectedPeriods, setLocalSelectedPeriods] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Fetch periods from the API only once
        api.get('/periodlist/')
            .then(response => {
                const fetchedPeriods = response.data;
                setPeriods(fetchedPeriods);
                setLocalSelectedPeriods(fetchedPeriods); // Select all by default
                onPeriodChange(fetchedPeriods); // Notify parent component with initial selection
            })
            .catch(error => {
                console.error('Error fetching periods', error);
            });
    }, []); // Empty dependency array ensures this effect runs only once

    const handlePeriodChange = (period) => {
        const newSelectedPeriods = localSelectedPeriods.includes(period)
            ? localSelectedPeriods.filter(p => p !== period)
            : [...localSelectedPeriods, period];
        setLocalSelectedPeriods(newSelectedPeriods);
        onPeriodChange(newSelectedPeriods);
    };

    const handleSelectAll = () => {
        if (localSelectedPeriods.length === periods.length) {
            setLocalSelectedPeriods([]);
            onPeriodChange([]);
        } else {
            setLocalSelectedPeriods(periods);
            onPeriodChange(periods);
        }
    };

    return (
        <Dropdown className="d-inline mx-2" autoClose="outside">
            <Dropdown.Toggle id="dropdown-autoclose-outside">
                Période
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item as="button" onClick={handleSelectAll}>
                    <FormCheck
                        type="checkbox"
                        label={localSelectedPeriods.length === periods.length ? "Deselect All" : "Select All"}
                        checked={localSelectedPeriods.length === periods.length}
                        onChange={handleSelectAll}
                    />
                </Dropdown.Item>
                {periods.map((period, index) => (
                    <Dropdown.Item
                        as="button"
                        key={index}
                        onClick={() => handlePeriodChange(period)}
                    >
                        <FormCheck
                            type="checkbox"
                            label={period}
                            checked={localSelectedPeriods.includes(period)}
                            onChange={() => handlePeriodChange(period)}
                        />
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default PeriodSelector;
