import React, { useState, useEffect } from 'react';
import api from '../api';

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
        <div>
            <button onClick={() => setIsOpen(!isOpen)}>
                Select Period
            </button>
            {isOpen && (
                <div className="dropdown">
                    <label>
                        <input
                            type="checkbox"
                            checked={localSelectedPeriods.length === periods.length}
                            onChange={handleSelectAll}
                        />
                        Select all
                    </label>
                    {periods.map((period, index) => (
                        <div key={index}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={localSelectedPeriods.includes(period)}
                                    onChange={() => handlePeriodChange(period)}
                                />
                                {period}
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PeriodSelector;
