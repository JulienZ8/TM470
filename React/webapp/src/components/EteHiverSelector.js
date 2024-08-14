import React, { useState, useEffect } from 'react';
import api from '../api';

function EteHiverSelector({ selectedEteHiver, onSeasonChange }) {
    const [seasons, setSeasons] = useState([]);
    const [localSelectedSeasons, setLocalSelectedSeasons] = useState(selectedEteHiver || []);
    const [isOpen, setIsOpen] = useState(false);  // State to track if dropdown is open

    useEffect(() => {
        api.get('/seasonlist/')
            .then(response => {
                setSeasons(response.data);
                setLocalSelectedSeasons(response.data); // Select all by default
            })
            .catch(error => {
                console.error('Error fetching seasons', error);
            });
    }, []);

    useEffect(() => {
        onSeasonChange(localSelectedSeasons);
    }, [localSelectedSeasons, onSeasonChange]);

    const handleSeasonChange = (season) => {
        if (localSelectedSeasons.includes(season)) {
            setLocalSelectedSeasons(localSelectedSeasons.filter(s => s !== season));
        } else {
            setLocalSelectedSeasons([...localSelectedSeasons, season]);
        }
    };

    const handleSelectAll = () => {
        if (localSelectedSeasons.length === seasons.length) {
            setLocalSelectedSeasons([]);
        } else {
            setLocalSelectedSeasons(seasons);
        }
    };

    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)}>
                Select Season
            </button>
            {isOpen && (  // Only show the dropdown when isOpen is true
                <div className="dropdown">
                    <label>
                        <input
                            type="checkbox"
                            checked={localSelectedSeasons.length === seasons.length}
                            onChange={handleSelectAll}
                        />
                        Select all
                    </label>
                    {seasons.map((season, index) => (
                        <div key={index}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={localSelectedSeasons.includes(season)}
                                    onChange={() => handleSeasonChange(season)}
                                />
                                {season}
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default EteHiverSelector;

