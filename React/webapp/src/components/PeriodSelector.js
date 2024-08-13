import React, { useState, useEffect } from 'react';

function PeriodSelector({ periods, onPeriodChange, selectedPeriods }) {
    const [localSelectedPeriods, setLocalSelectedPeriods] = useState(selectedPeriods || []);

    useEffect(() => {
        onPeriodChange(localSelectedPeriods);
    }, [localSelectedPeriods, onPeriodChange]);

    const handlePeriodChange = (period) => {
        if (localSelectedPeriods.includes(period)) {
            setLocalSelectedPeriods(localSelectedPeriods.filter(p => p !== period));
        } else {
            setLocalSelectedPeriods([...localSelectedPeriods, period]);
        }
    };

    const handleSelectAll = () => {
        if (localSelectedPeriods.length === periods.length) {
            setLocalSelectedPeriods([]);
        } else {
            setLocalSelectedPeriods(periods);
        }
    };

    return (
        <div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={localSelectedPeriods.length === periods.length}
                        onChange={handleSelectAll}
                    />
                    Select all
                </label>
            </div>
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
    );
}

export default PeriodSelector;
