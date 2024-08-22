import React, { useState, useEffect } from 'react';
import api from '../api';

import { Form } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';

function PeriodSelector({ onPeriodChange }) {
    const [periods, setPeriods] = useState([]);
    const [localSelectedPeriods, setLocalSelectedPeriods] = useState([]);

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

        <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Période</Accordion.Header>
                    <Accordion.Body>
                        <Form.Check
                            type="checkbox"
                            label={localSelectedPeriods.length === periods.length ? "Deselect All" : "Select All"}
                            checked={localSelectedPeriods.length === periods.length}
                            onChange={handleSelectAll}
                        />
                        {periods.map((period, index) => (
                            <Form.Check
                                key={index}
                                type="checkbox"
                                label={period}
                                checked={localSelectedPeriods.includes(period)}
                                onChange={() => handlePeriodChange(period)}
                            />
                        ))}
                    </Accordion.Body>
            </Accordion.Item>
        </Accordion>

    );
}

export default PeriodSelector;
