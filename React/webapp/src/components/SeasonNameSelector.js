import React, { useState, useEffect } from 'react';
import api from '../api';
import { Dropdown, DropdownButton, FormCheck } from 'react-bootstrap';

function SeasonNameSelector({ onSeasonChange }) {
    const [seasonNames, setSeasonNames] = useState([]);
    const [localSelectedSeasonNames, setLocalSelectedSeasonNames] = useState([]);

    useEffect(() => {
        api.get('/seasonnamelist/')
            .then(response => {
                const fetchedSeasonNames = response.data;
                setSeasonNames(fetchedSeasonNames);
                setLocalSelectedSeasonNames(fetchedSeasonNames); // Select all by default
                onSeasonChange(fetchedSeasonNames); // Notify parent component with initial selection
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
        <Dropdown className="d-inline mx-2" autoClose="outside">
            <Dropdown.Toggle id="dropdown-autoclose-outside">
                Saison
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item as="button" onClick={handleSelectAll}>
                    <FormCheck
                        type="checkbox"
                        label={localSelectedSeasonNames.length === seasonNames.length ? "Deselect All" : "Select All"}
                        checked={localSelectedSeasonNames.length === seasonNames.length}
                        onChange={handleSelectAll}
                    />
                </Dropdown.Item>
                {seasonNames.map((seasonName, index) => (
                    <Dropdown.Item
                        as="button"
                        key={index}
                        onClick={() => handleSeasonChange(seasonName)}
                    >
                        <FormCheck
                            type="checkbox"
                            label={seasonName}
                            checked={localSelectedSeasonNames.includes(seasonName)}
                            onChange={() => handleSeasonChange(seasonName)}
                        />
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default SeasonNameSelector;

