import React, { useState } from 'react';
import PeriodSelector from './components/PeriodSelector';
import SeasonNameSelector from './components/SeasonNameSelector';
import SeasonEntriesChartGrouped from './components/SeasonEntriesChartGrouped';

function App() {
    const [selectedPeriods, setSelectedPeriods] = useState([]);
    const [selectedSeasons, setSelectedSeasons] = useState([]);

    const handlePeriodChange = (periods) => {
        setSelectedPeriods(periods);
    };

    const handleSeasonChange = (seasons) => {
        setSelectedSeasons(seasons);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
                <PeriodSelector selectedPeriods={selectedPeriods} onPeriodChange={handlePeriodChange} />
                <SeasonNameSelector selectedSeasons={selectedSeasons} onSeasonChange={handleSeasonChange} />
            </div>
            <div style={{ flex: 1 }}>
                <SeasonEntriesChartGrouped selectedPeriods={selectedPeriods} selectedSeasons={selectedSeasons} />
            </div>
        </div>
    );
}

export default App;

