import React, { useState, useEffect } from 'react';
import api from '../api';
import { Form } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';

function PassSelector({ onPassChange }) {
    const [passCategories, setPassCategories] = useState([]);
    const [selectedPasses, setSelectedPasses] = useState([]);

    useEffect(() => {
        api.get('/passlist/')
            .then(response => {
                const fetchedPasses = ['Non-classifié', ...response.data]; // Add "Non-classifié" to the list
                setPassCategories(fetchedPasses);
                setSelectedPasses(fetchedPasses); // Select all by default
                onPassChange(fetchedPasses.map(pass => pass === 'Non-classifié' ? null : pass)); // Map "Non-classifié" to null
            })
            .catch(error => {
                console.error('Error fetching pass categories', error);
            });
    }, []);

    const handlePassChange = (pass) => {
        let newSelectedPasses = [];

        if (pass === 'Non-classifié') {
            newSelectedPasses = selectedPasses.includes(pass) ? [] : ['Non-classifié'];
        } else {
            newSelectedPasses = selectedPasses.includes(pass)
                ? selectedPasses.filter(p => p !== pass)
                : [...selectedPasses.filter(p => p !== 'Non-classifié'), pass];
        }

        setSelectedPasses(newSelectedPasses);
        onPassChange(newSelectedPasses.map(p => p === 'Non-classifié' ? null : p)); // Map "Non-classifié" to null
    };

    const handleSelectAll = () => {
        if (selectedPasses.length === passCategories.length) {
            setSelectedPasses([]);
            onPassChange([]);
        } else {
            setSelectedPasses(passCategories);
            onPassChange(passCategories.map(pass => pass === 'Non-classifié' ? null : pass)); // Map "Non-classifié" to null
        }
    };

    return (
        <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Catégorie de forfait</Accordion.Header>
                <Accordion.Body>
                    <Form.Check
                        type="checkbox"
                        label={selectedPasses.length === passCategories.length ? "Deselect All" : "Select All"}
                        checked={selectedPasses.length === passCategories.length}
                        onChange={handleSelectAll}
                    />
                    {passCategories.map((pass, index) => (
                        <Form.Check
                            key={index}
                            type="checkbox"
                            label={pass}
                            checked={selectedPasses.includes(pass)}
                            onChange={() => handlePassChange(pass)}
                        />
                    ))}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default PassSelector;