import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import React Router components
import PeriodSelector from './components/PeriodSelector';
import SeasonNameSelector from './components/SeasonNameSelector';
import EteHiverSelector from './components/EteHiverSelector';
import PassSelector from './components/PassSelector';
import SeasonEntriesChartGrouped from './components/SeasonEntriesChartGrouped';
import ReferenceSeasonSelector from './components/ReferenceSeasonSelector';
import ComparisonLineChart from './components/ComparisonLineChart';
import UpdatePassClassification from './components/UpdatePassClassification'; // New page for updating pass classifications
import LanguageSelector from './components/LanguageSelector';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import './App.css';
import gypaeteImage from './images/gypaete.png';
import { useTranslation } from 'react-i18next';  // Import the useTranslation hook

function App() {
    const { t } = useTranslation(); // Initialize the translation function
    // State variables to hold the selected filter options and the filtered data
    const [selectedPeriods, setSelectedPeriods] = useState([]);
    const [selectedSeasonNames, setSelectedSeasonNames] = useState([]);
    const [selectedSeasons, setSelectedSeasons] = useState([]);
    const [selectedPasses, setSelectedPass] = useState([]);
    const [referenceSeason, setReferenceSeason] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    // Memoized handlers using useCallback to prevent unnecessary re-renders
    const handlePeriodChange = useCallback((periods) => {
        setSelectedPeriods(periods);
    }, []);

    const handleSeasonNameChange = useCallback((seasonNames) => {
        setSelectedSeasonNames(seasonNames);
    }, []);

    const handleSeasonChange = useCallback((seasons) => {
        setSelectedSeasons(seasons);
    }, []);

    const handlePassChange = useCallback((pass) => {
        setSelectedPass(pass);
    }, []);

    const handleReferenceSeasonChange = useCallback((season) => {
        setReferenceSeason(season);
    }, []);

    const handleFilteredDataChange = useCallback((filtered) => {
        setFilteredData(filtered);
    }, []);

    return (
        <Router>
            <Navbar expand="lg" className="bg-body-tertiary mb-4">
                <Container>
                    <Navbar.Brand as={Link} to="/">Gypaete Dashboard</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link> {/* Link to home page */}
                            <Nav.Link as={Link} to="/update-pass">{t('card.updateForm')}</Nav.Link> {/* Link to update page */}
                        </Nav>
                        {/* Language Selector on the right */}
                        <Nav className="ms-auto">
                            <LanguageSelector />
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Routes>
                {/* Main dashboard page */}
                <Route
                    path="/"
                    element={
                        <Container fluid>
                            <Row className="py-3">
                                <Col className="menu" md={3}>
                                    <img src={gypaeteImage} alt="Menu Header" style={{ width: '100%', marginBottom: '20px' }} />
                                    {/* Render all the selectors */}
                                    <PeriodSelector onPeriodChange={handlePeriodChange} />
                                    <SeasonNameSelector onSeasonChange={handleSeasonNameChange} />
                                    <EteHiverSelector onSeasonChange={handleSeasonChange} />
                                    <PassSelector onPassChange={handlePassChange} />
                                    <ReferenceSeasonSelector onReferenceSeasonChange={handleReferenceSeasonChange} />
                                </Col>
                                <Col md={9}>
                                    <div style={{ marginBottom: '20px' }}>
                                        {/* Season Entries Chart */}
                                        <SeasonEntriesChartGrouped
                                            selectedPeriods={selectedPeriods}
                                            selectedSeasonNames={selectedSeasonNames}
                                            selectedEteHiver={selectedSeasons}
                                            selectedPasses={selectedPasses}
                                            onFilteredDataChange={handleFilteredDataChange}
                                        />
                                    </div>
                                    <div>
                                        {/* Comparison Line Chart */}
                                        <ComparisonLineChart
                                            filteredData={filteredData}
                                            referenceSeason={referenceSeason}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    }
                />

                {/* New route for updating pass classifications */}
                <Route path="/update-pass" element={<UpdatePassClassification />} />
            </Routes>
        </Router>
    );
}

export default App;
