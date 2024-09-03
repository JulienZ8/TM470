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
import './App.css'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import gypaeteImage from './images/gypaete.png';

function App() { //State variables to hold the selected filter options and the filtered data
    const [selectedPeriods, setSelectedPeriods] = useState([]);
    const [selectedSeasonNames, setSelectedSeasonNames] = useState([]);
    const [selectedSeasons, setSelectedSeasons] = useState([]);
    const [selectedPasses, setSelectedPass] = useState([]);
    const [referenceSeason, setReferenceSeason] = useState("");
    const [filteredData, setFilteredData] = useState([]);  //State to hold the filtered data

    //Handlers to update state based on the selected options
    const handlePeriodChange = (periods) => { 
        setSelectedPeriods(periods); //Update selected periods
    };

    const handleSeasonNameChange = (seasonNames) => {
        setSelectedSeasonNames(seasonNames); //Update selected season names (2019-2020, 2021-2022, etc..)
    };

    const handleSeasonChange = (seasons) => {
        setSelectedSeasons(seasons); //Update selected seasons (été/hiver)
    };

    const handlePassChange = (pass) => {
        setSelectedPass(pass); //Update select pass categories
    };

    const handleReferenceSeasonChange = (season) => {
        setReferenceSeason(season); //Update the selected reference season
    };

    const handleFilteredDataChange = (filtered) => {
        setFilteredData(filtered);  // Update the filtered data state
    };

    return (
        <Container fluid>
            <Row className="py-3">
                <Col className="menu">
                    <img src={gypaeteImage} alt="Menu Header" style={{ width: '100%', marginBottom: '20px' }} />
                    {/* Render all the selectors, passing the corresponding handler functions as props */}
                    <PeriodSelector onPeriodChange={handlePeriodChange} />
                    <SeasonNameSelector onSeasonChange={handleSeasonNameChange} />
                    <EteHiverSelector onSeasonChange={handleSeasonChange} />
                    <PassSelector onPassChange={handlePassChange} />
                    <ReferenceSeasonSelector onReferenceSeasonChange={handleReferenceSeasonChange} />
                </Col>
                <Col md={9}>
                    <div style={{ marginBottom: '20px' }}>
                        {/* Render the SeasonEntriesChartGrouped, passing the selected filters as props */}
                        <SeasonEntriesChartGrouped
                            selectedPeriods={selectedPeriods}
                            selectedSeasonNames={selectedSeasonNames}
                            selectedEteHiver={selectedSeasons}
                            selectedPasses={selectedPasses}
                            onFilteredDataChange={handleFilteredDataChange}  //Pass filtered data up to the parent
                        />
                    </div>  
                    <div >
                        {/* Render the ComparisonLineChart, passing the filtered data and reference season as props */}
                        <ComparisonLineChart
                            filteredData={filteredData}  //Pass the filtered data to the chart
                            referenceSeason={referenceSeason} //Pass the reference season to the chart
                        />
                    </div>    
                </Col>
            </Row>
        </Container>
    );
}

export default App;