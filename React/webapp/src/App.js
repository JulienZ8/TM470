import React, { useState } from 'react';
import SeasonEntriesChartGrouped from './components/SeasonEntriesChartGrouped';
import PeriodSelector from './components/PeriodSelector';
import SeasonSelector from './components/SeasonSelector';
import DropdownMenu from './components/DropdownMenu';

function App() {
    const periods = [
        'Basse saison d\'hiver', 'Fin de saison d\'hiver', 'Haute saison d\'hiver',
        'Noël et Nouvel An', 'Pré-saison hiver', 'Automne', 'Haute saison été', 'Pré-saison été'
    ];

    const seasons = [
        '2018-2019', '2019-2020', '2020-2021',
        '2021-2022', '2022-2023', '2023-2024'
    ];

    // Select all by default
    const [selectedPeriods, setSelectedPeriods] = useState(periods);
    const [selectedSeasons, setSelectedSeasons] = useState(seasons);

    // State to control which dropdown is open
    const [openDropdown, setOpenDropdown] = useState(null);

    const handleDropdownToggle = (dropdownName) => {
        // Close the other dropdown if one is already open
        setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    };

    return (
        <div className="App" style={{ display: 'flex', height: '100vh' }}>
            <div style={{
                flex: '1',
                backgroundColor: '#f0f0f0',
                padding: '20px',
                boxSizing: 'border-box',
            }}>
                <DropdownMenu 
                    label="Select Periods" 
                    isOpen={openDropdown === 'periods'} 
                    onToggle={() => handleDropdownToggle('periods')}
                >
                    <PeriodSelector 
                        periods={periods} 
                        onPeriodChange={setSelectedPeriods} 
                        selectedPeriods={selectedPeriods} 
                    />
                </DropdownMenu>
                <DropdownMenu 
                    label="Select Seasons" 
                    isOpen={openDropdown === 'seasons'} 
                    onToggle={() => handleDropdownToggle('seasons')}
                    style={{ marginTop: '10px' }}
                >
                    <SeasonSelector 
                        seasons={seasons} 
                        onSeasonChange={setSelectedSeasons} 
                        selectedSeasons={selectedSeasons} 
                    />
                </DropdownMenu>
            </div>
            <div style={{
                flex: '4',
                padding: '20px',
                boxSizing: 'border-box',
            }}>
                <SeasonEntriesChartGrouped 
                    selectedPeriods={selectedPeriods} 
                    selectedSeasons={selectedSeasons} 
                />
            </div>
        </div>
    );
}

export default App;
