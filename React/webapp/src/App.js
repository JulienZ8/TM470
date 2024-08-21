import React, { useState } from 'react';
import PeriodSelector from './components/PeriodSelector';
import SeasonNameSelector from './components/SeasonNameSelector';
import EteHiverSelector from './components/EteHiverSelector';
import PassSelector from './components/PassSelector';  // New import
import SeasonEntriesChartGrouped from './components/SeasonEntriesChartGrouped';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';

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
            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px', minWidth: '200px' }}>
                <PeriodSelector onPeriodChange={handlePeriodChange} />
                <SeasonNameSelector onSeasonChange={handleSeasonNameChange} />
                <EteHiverSelector onSeasonChange={handleSeasonChange} />
                <PassSelector onPassChange={handlePassChange} /> {/* Add the new selector */}
            </div>
            <div style={{ padding: '20px', flex: 1, width: '800px', height: '600px' }}>
            <Card style={{  width: 'auto', height: 'auto' }}>
                <Card.Body>
                    <div style={{ position: 'relative', height: '400px' }}>
                        <SeasonEntriesChartGrouped
                            selectedPeriods={selectedPeriods}
                            selectedSeasonNames={selectedSeasonNames}
                            selectedEteHiver={selectedSeasons}
                            selectedPass={selectedPass} // Pass the selected pass to the chart
                        />
                    </div>
                </Card.Body>
            </Card>
            </div>
        </div>
        
    );
}

export default App;


