import React, { useState, useEffect } from 'react';
import api from '../api';
import { Dropdown, DropdownButton, FormCheck } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';

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
        <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Été/hiver</Accordion.Header>
                <Accordion.Body>
                    <Form.Check
                        type="checkbox"
                        label={localSelectedSeasons.length === seasons.length ? "Deselect All" : "Select All"}
                        checked={localSelectedSeasons.length === seasons.length}
                        onChange={handleSelectAll}
                    />
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
        /*<Dropdown className="d-inline mx-2" autoClose="outside">
            <Dropdown.Toggle id="dropdown-autoclose-outside">
                Été/hiver
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item as="button" onClick={handleSelectAll}>
                    <FormCheck
                        type="checkbox"
                        label={localSelectedSeasons.length === seasons.length ? "Deselect All" : "Select All"}
                        checked={localSelectedSeasons.length === seasons.length}
                        onChange={handleSelectAll}
                    />
                </Dropdown.Item>
                {seasons.map((season, index) => (
                    <Dropdown.Item
                        as="button"
                        key={index}
                        onClick={() => handleSeasonChange(season)}
                    >
                        <FormCheck
                            type="checkbox"
                            label={season}
                            checked={localSelectedSeasons.includes(season)}
                            onChange={() => handleSeasonChange(season)}
                        />
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>*/
    );
}

export default EteHiverSelector;

