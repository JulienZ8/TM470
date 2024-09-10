import React, { useState, useEffect, useCallback } from 'react';
import PeriodSelector from './components/PeriodSelector';
import SeasonNameSelector from './components/SeasonNameSelector';
import EteHiverSelector from './components/EteHiverSelector';
import PassSelector from './components/PassSelector';
import SeasonEntriesChartGrouped from './components/SeasonEntriesChartGrouped';
import ReferenceSeasonSelector from './components/ReferenceSeasonSelector';
import ComparisonLineChart from './components/ComparisonLineChart';
import LanguageSelector from './components/LanguageSelector';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './App.css'; 
import gypaeteImage from './images/gypaete.png';

function App() { //State variables to hold the selected filter options and the filtered data
    const [selectedPeriods, setSelectedPeriods] = useState([]);
    const [selectedSeasonNames, setSelectedSeasonNames] = useState([]);
    const [selectedSeasons, setSelectedSeasons] = useState([]);
    const [selectedPasses, setSelectedPass] = useState([]);
    const [referenceSeason, setReferenceSeason] = useState("");
    const [filteredData, setFilteredData] = useState([]);  //State to hold the filtered data

    //Memoized handlers using useCallback to prevent unnecessary re-renders
    const handlePeriodChange = useCallback((periods) => {
        setSelectedPeriods(periods); //Update selected periods
    }, []); //Empty dependency array ensures it only changes when needed

    const handleSeasonNameChange = useCallback((seasonNames) => {
        setSelectedSeasonNames(seasonNames); //Update selected season names (2019-2020, 2021-2022, etc..)
    }, []);

    const handleSeasonChange = useCallback((seasons) => {
        setSelectedSeasons(seasons); //Update selected seasons (été/hiver)
    }, []);

    const handlePassChange = useCallback((pass) => {
        setSelectedPass(pass); //Update selected pass categories
    }, []);

    const handleReferenceSeasonChange = useCallback((season) => {
        setReferenceSeason(season); //Update the selected reference season
    }, []);

    const handleFilteredDataChange = useCallback((filtered) => {
        setFilteredData(filtered);  //Update the filtered data state
    }, []);

    return (
        <Container fluid>
            {/* Navbar at the top */}
            <Navbar expand="lg" className="bg-body-tertiary mb-4">
                <Container>
                    <Navbar.Brand href="#home">Gypaete Dashboard</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#link">Link</Nav.Link>
                            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        {/* Language Selector on the right */}
                        <Nav className="ms-auto">
                            <LanguageSelector />
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Rest of the app layout */}
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
                            onFilteredDataChange={handleFilteredDataChange} 
                        />
                    </div>  
                    <div>
                        {/* Render the ComparisonLineChart, passing the filtered data and reference season as props */}
                        <ComparisonLineChart
                            filteredData={filteredData} 
                            referenceSeason={referenceSeason} 
                        />
                    </div>    
                </Col>
            </Row>
        </Container>
    );
}

export default App;