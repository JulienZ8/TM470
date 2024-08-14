import React, { useState } from 'react';
import PeriodSelector from './components/PeriodSelector';
import SeasonNameSelector from './components/SeasonNameSelector';
import SeasonEntriesChartGrouped from './components/SeasonEntriesChartGrouped';
import EteHiverSelector from './components/EteHiverSelector'; // Import the new selector

function App() {
    const [selectedPeriods, setSelectedPeriods] = useState([]);
    const [selectedSeasonNames, setSelectedSeasonNames] = useState([]);
    const [selectedEteHiver, setSelectedEteHiver] = useState([]);
    
    const handlePeriodChange = (periods) => {
        setSelectedPeriods(periods);
    };

    const handleSeasonNameChange = (seasonNames) => {
        setSelectedSeasonNames(seasonNames);
    };

    const handleEteHiverChange = (seasons) => {
        setSelectedEteHiver(seasons);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
                <PeriodSelector selectedPeriods={selectedPeriods} onPeriodChange={handlePeriodChange} />
                <SeasonNameSelector selectedSeasonNames={selectedSeasonNames} onSeasonChange={handleSeasonNameChange} />
                <EteHiverSelector selectedEteHiver={selectedEteHiver} onSeasonChange={handleEteHiverChange} />
            </div>
            <div style={{ flex: 1 }}>
                <SeasonEntriesChartGrouped
                    selectedPeriods={selectedPeriods}
                    selectedSeasonNames={selectedSeasonNames}
                    selectedEteHiver={selectedEteHiver}
                />
            </div>
        </div>
    );
}

export default App;
