import React, { useState, useEffect } from 'react';
import api from '../api';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';

function SeasonNameSelector({ onSeasonChange }) {
    const [seasonNames, setSeasonNames] = useState([]);
    const [localSelectedSeasonNames, setLocalSelectedSeasonNames] = useState([]);

    useEffect(() => {
        api.get('/seasonnamelist/')
            .then(response => {
                const sortedSeasons = response.data.sort(); // Sort seasons alphabetically (assumes chronological order)
                setSeasonNames(sortedSeasons);
                setLocalSelectedSeasonNames(sortedSeasons); // Select all by default
                onSeasonChange(sortedSeasons); // Notify parent component with initial selection
            })
            .catch(error => {
                console.error('Error fetching season names', error);
            });
    }, []);

    const handleSeasonChange = (seasonName) => {
        const newSelectedSeasonNames = localSelectedSeasonNames.includes(seasonName)
            ? localSelectedSeasonNames.filter(s => s !== seasonName)
            : [...localSelectedSeasonNames, seasonName];
        setLocalSelectedSeasonNames(newSelectedSeasonNames);
        onSeasonChange(newSelectedSeasonNames);
    };

    const handleSelectAll = () => {
        if (localSelectedSeasonNames.length === seasonNames.length) {
            setLocalSelectedSeasonNames([]);
            onSeasonChange([]);
        } else {
            setLocalSelectedSeasonNames(seasonNames);
            onSeasonChange(seasonNames);
        }
    };

    return (
        <Accordion className="shadow-sm">
            <Accordion.Item eventKey="0">
                <Accordion.Header>Saison</Accordion.Header>
                <Accordion.Body>
                    <Form.Check
                        type="checkbox"
                        label={localSelectedSeasonNames.length === seasonNames.length ? "Deselect All" : "Select All"}
                        checked={localSelectedSeasonNames.length === seasonNames.length}
                        onChange={handleSelectAll}
                    />
                    {seasonNames.map((seasonName, index) => (
                        <Form.Check
                            key={index}
                            type="checkbox"
                            label={seasonName}
                            checked={localSelectedSeasonNames.includes(seasonName)}
                            onChange={() => handleSeasonChange(seasonName)}
                        />
                    ))}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>

    );
}

export default SeasonNameSelector;

