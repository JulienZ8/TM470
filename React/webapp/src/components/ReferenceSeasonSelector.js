import React, { useState, useEffect } from 'react';
import { Dropdown, FormCheck } from 'react-bootstrap';
import api from '../api';

function ReferenceSeasonSelector({ selectedReferenceSeason, onReferenceSeasonChange }) {
    const [seasons, setSeasons] = useState([]);
    const [localSelectedSeason, setLocalSelectedSeason] = useState(selectedReferenceSeason || "");

    useEffect(() => {
        // Fetch seasons from the API
        api.get('/seasonnamelist/')
            .then(response => {
                setSeasons(response.data);
                if (response.data.length > 0 && !selectedReferenceSeason) {
                    const defaultSeason = response.data[0];
                    setLocalSelectedSeason(defaultSeason);
                    onReferenceSeasonChange(defaultSeason); // Set the first season as default
                }
            })
            .catch(error => {
                console.error('Error fetching seasons', error);
            });
    }, []);

    const handleSeasonChange = (season) => {
        setLocalSelectedSeason(season);
        onReferenceSeasonChange(season);
    };

    return (
        <Dropdown className="d-inline mx-2" autoClose="outside">
            <Dropdown.Toggle id="dropdown-autoclose-outside">
                Saison référence
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {seasons.map((season, index) => (
                    <Dropdown.Item
                        as="button"
                        key={index}
                        onClick={() => handleSeasonChange(season)}
                    >
                        <FormCheck
                            type="radio"
                            label={season}
                            checked={localSelectedSeason === season}
                            onChange={() => handleSeasonChange(season)}
                        />
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default ReferenceSeasonSelector;
