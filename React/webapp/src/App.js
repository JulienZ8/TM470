import React, { useState } from 'react';
import PeriodSelector from './components/PeriodSelector';
import SeasonNameSelector from './components/SeasonNameSelector';
import EteHiverSelector from './components/EteHiverSelector';
import PassSelector from './components/PassSelector';  // New import
import SeasonEntriesChartGrouped from './components/SeasonEntriesChartGrouped';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [selectedPeriods, setSelectedPeriods] = useState([]);
    const [selectedSeasonNames, setSelectedSeasonNames] = useState([]);
    const [selectedSeasons, setSelectedSeasons] = useState([]);
    const [selectedPass, setSelectedPass] = useState('All'); // New state

    const handlePeriodChange = (periods) => {
        setSelectedPeriods(periods);
    };

    const handleSeasonNameChange = (seasonNames) => {
        setSelectedSeasonNames(seasonNames);
    };

    const handleSeasonChange = (seasons) => {
        setSelectedSeasons(seasons);
    };

    const handlePassChange = (pass) => {
        setSelectedPass(pass);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
                <PeriodSelector onPeriodChange={handlePeriodChange} />
                <SeasonNameSelector onSeasonChange={handleSeasonNameChange} />
                <EteHiverSelector onSeasonChange={handleSeasonChange} />
                <PassSelector onPassChange={handlePassChange} /> {/* Add the new selector */}
            </div>
            <div style={{ flex: 1 }}>
                <SeasonEntriesChartGrouped
                    selectedPeriods={selectedPeriods}
                    selectedSeasonNames={selectedSeasonNames}
                    selectedEteHiver={selectedSeasons}
                    selectedPass={selectedPass} // Pass the selected pass to the chart
                />
            </div>
        </div>
    );
}

export default App;
