import React, { useState, useEffect } from 'react';
import api from '../api';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';  // Import the useTranslation hook

function EteHiverSelector({ onSeasonChange }) {
    const { t } = useTranslation(); // Initialize the translation function
    const [seasons, setSeasons] = useState([]); //State to hold the list of seasons fetched from the API
    const [localSelectedSeasons, setLocalSelectedSeasons] = useState([]); //State to hold the currently selected seasons

    //Fetch the list of seasons from the API when the component mounts
    useEffect(() => {
        api.get('/seasonlist/')
            .then(response => {
                const fetchedSeasons = response.data;
                setSeasons(fetchedSeasons); //Store fetched seasons in state
                setLocalSelectedSeasons(fetchedSeasons); //Select all seasons by default
                onSeasonChange(fetchedSeasons); // Notify parent component with initial selection
            })
            .catch(error => {
                console.error('Error fetching seasons', error); //Handle any errors
            });
    }, []); //Empty dependency array ensures this effect runs only once

    //Handle the selection/deselection of a single season
    const handleSeasonChange = (season) => {
        const newSelectedSeasons = localSelectedSeasons.includes(season)
            ? localSelectedSeasons.filter(s => s !== season)
            : [...localSelectedSeasons, season];
        setLocalSelectedSeasons(newSelectedSeasons);
        onSeasonChange(newSelectedSeasons);
    };

    //Handle the "Select All" or "Deselect All" functionality
    const handleSelectAll = () => {
        if (localSelectedSeasons.length === seasons.length) { //If all seasons are selected, deselect all
            setLocalSelectedSeasons([]);
            onSeasonChange([]);
        } else { //Otherwise, select all seasons
            setLocalSelectedSeasons(seasons);
            onSeasonChange(seasons);
        }
    };

    return (
        <Accordion className="shadow-sm"> {/* Accordion with a shadow */}
            <Accordion.Item eventKey="0"> {/* Single Accordion item */}
                <Accordion.Header>{t('accordion.eteHiver')}</Accordion.Header>
                <Accordion.Body>
                    {/* Select All / Deselect all checkbox */}
                    <Form.Check 
                        type="checkbox"
                        label={localSelectedSeasons.length === seasons.length ? t('accordion.deselectAll') : t('accordion.selectAll')}
                        checked={localSelectedSeasons.length === seasons.length}
                        onChange={handleSelectAll}
                    />
                    {/* Ete/Hiver checkboxes */}
                    {seasons.map((season, index) => (
                        <Form.Check
                            key={index}
                            type="checkbox"
                            label={season}
                            checked={localSelectedSeasons.includes(season)}
                            onChange={() => handleSeasonChange(season)}
                        />
                    ))}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>

    );
}

export default EteHiverSelector;