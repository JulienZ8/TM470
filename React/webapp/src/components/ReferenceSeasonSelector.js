import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import api from '../api';

function ReferenceSeasonSelector({ selectedReferenceSeason, onReferenceSeasonChange }) {
    const [seasons, setSeasons] = useState([]);
    const [localSelectedSeason, setLocalSelectedSeason] = useState(selectedReferenceSeason || "");

    useEffect(() => {
        api.get('/seasonnamelist/') // Fetch seasons from the API
            .then(response => {
                const sortedSeasons = response.data.sort(); // Sort seasons chronologically
                setSeasons(sortedSeasons);
                if (sortedSeasons.length > 0 && !selectedReferenceSeason) {
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
        <Accordion>
            <Accordion.Item eventKey="1">
                <Accordion.Header>Saison référence</Accordion.Header>
                <Accordion.Body>
                    {/* Loop over the sorted seasons to create a radio button for each */}
                    {seasons.map((season, index) => (
                        <Form.Check
                            key={index}
                            type="radio"
                            label={season}
                            checked={localSelectedSeason === season}
                            onChange={() => handleSeasonChange(season)}
                        />
                    ))}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default ReferenceSeasonSelector;
