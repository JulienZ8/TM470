import React, { useState, useEffect } from 'react';
import api from '../api';

function SeasonNameSelector({ onSeasonChange }) {
    const [seasons, setSeasons] = useState([]);
    const [localSelectedSeasons, setLocalSelectedSeasons] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Fetch seasons from the API only once
        api.get('/seasonnamelist/')
            .then(response => {
                const fetchedSeasons = response.data;
                setSeasons(fetchedSeasons);
                setLocalSelectedSeasons(fetchedSeasons); // Select all by default
                onSeasonChange(fetchedSeasons); // Notify parent component with initial selection
            })
            .catch(error => {
                console.error('Error fetching seasons', error);
            });
    }, []); // Empty dependency array ensures this effect runs only once

    const handleSeasonChange = (season) => {
        const newSelectedSeasons = localSelectedSeasons.includes(season)
            ? localSelectedSeasons.filter(s => s !== season)
            : [...localSelectedSeasons, season];
        setLocalSelectedSeasons(newSelectedSeasons);
        onSeasonChange(newSelectedSeasons);
    };

    const handleSelectAll = () => {
        if (localSelectedSeasons.length === seasons.length) {
            setLocalSelectedSeasons([]);
            onSeasonChange([]);
        } else {
            setLocalSelectedSeasons(seasons);
            onSeasonChange(seasons);
        }
    };

    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)}>
                Saison
            </button>
            {isOpen && (
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

export default SeasonNameSelector;
