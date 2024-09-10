import React, { useState, useEffect } from 'react';
import api from '../api';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';  // Import the useTranslation hook

function SeasonNameSelector({ onSeasonChange }) {
    const { t } = useTranslation(); // Initialize the translation function
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
                <Accordion.Header>{t('accordion.season')}</Accordion.Header>
                <Accordion.Body>
                    <Form.Check
                        type="checkbox"
                        label={localSelectedSeasonNames.length === seasonNames.length ? t('accordion.deselectAll') : t('accordion.selectAll')}
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