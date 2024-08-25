import React, { useState, useEffect } from 'react';
import PeriodSelector from './components/PeriodSelector';
import SeasonNameSelector from './components/SeasonNameSelector';
import EteHiverSelector from './components/EteHiverSelector';
import PassSelector from './components/PassSelector';
import SeasonEntriesChartGrouped from './components/SeasonEntriesChartGrouped';
import ReferenceSeasonSelector from './components/ReferenceSeasonSelector';
import ComparisonLineChart from './components/ComparisonLineChart';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import './App.css';  // Import your CSS file

function App() {
    const [selectedPeriods, setSelectedPeriods] = useState([]);
    const [selectedSeasonNames, setSelectedSeasonNames] = useState([]);
    const [selectedSeasons, setSelectedSeasons] = useState([]);
    const [selectedPasses, setSelectedPass] = useState('All');
    const [referenceSeason, setReferenceSeason] = useState("");
    const [filteredData, setFilteredData] = useState([]);  // State to hold the filtered data

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

    const handleReferenceSeasonChange = (season) => {
        setReferenceSeason(season);
    };

    const handleFilteredDataChange = (filtered) => {
        setFilteredData(filtered);  // Update the filtered data state
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px', minWidth: '200px'}}>
                <PeriodSelector onPeriodChange={handlePeriodChange} />
                <SeasonNameSelector onSeasonChange={handleSeasonNameChange} />
                <EteHiverSelector onSeasonChange={handleSeasonChange} />
                <PassSelector onPassChange={handlePassChange} />
                <ReferenceSeasonSelector onReferenceSeasonChange={handleReferenceSeasonChange} />
            </div>
            <Container fluid>
            
            
            <div className="chart-container"> 
                    
                        <SeasonEntriesChartGrouped
                            selectedPeriods={selectedPeriods}
                            selectedSeasonNames={selectedSeasonNames}
                            selectedEteHiver={selectedSeasons}
                            selectedPasses={selectedPasses}
                            onFilteredDataChange={handleFilteredDataChange}  // Pass filtered data up to the parent
                        />
            </div>  
            
            <div className="chart-container">     
                    <ComparisonLineChart
                        filteredData={filteredData}  // Use the filtered data
                        referenceSeason={referenceSeason}
                    />
            </div>    
            
            </Container>
            
        </div>
    );
}

export default App;

