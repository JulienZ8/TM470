// SeasonSelector.js

import React, { useState, useEffect } from 'react';
import api from '../api';

function SeasonSelector({ selectedSeason, onSeasonChange }) {
    const [seasons, setSeasons] = useState([]);
    const [localSelectedSeason, setLocalSelectedSeason] = useState(selectedSeason || []);

    useEffect(() => {
        api.get('/seasonlist/')
            .then(response => {
                setSeasons(response.data);
                setLocalSelectedSeason(response.data); // Select all by default
            })
            .catch(error => {
                console.error('Error fetching seasons', error);
            });
    }, []);

    useEffect(() => {
        onSeasonChange(localSelectedSeason);
    }, [localSelectedSeason, onSeasonChange]);

    const handleSeasonChange = (season) => {
        if (localSelectedSeason.includes(season)) {
            setLocalSelectedSeason(localSelectedSeason.filter(s => s !== season));
        } else {
            setLocalSelectedSeason([...localSelectedSeason, season]);
        }
    };

    const handleSelectAll = () => {
        if (localSelectedSeason.length === seasons.length) {
            setLocalSelectedSeason([]);
        } else {
            setLocalSelectedSeason(seasons);
        }
    };

    return (
        <div>
            <button onClick={handleSelectAll}>
                Select Seasons
            </button>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={localSelectedSeason.length === seasons.length}
                        onChange={handleSelectAll}
                    />
                    Select all
                </label>
            </div>
            {seasons.map((season, index) => (
                <div key={index}>
                    <label>
                        <input
                            type="checkbox"
                            checked={localSelectedSeason.includes(season)}
                            onChange={() => handleSeasonChange(season)}
                        />
                        {season}
                    </label>
                </div>
            ))}
        </div>
    );
}

export default SeasonSelector;
