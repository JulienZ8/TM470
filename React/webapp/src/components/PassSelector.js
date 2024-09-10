import React, { useContext, useState, useEffect } from 'react';
import api from '../api';
import { Form } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import { useTranslation } from 'react-i18next';  // Import the useTranslation hook

function PassSelector({ onPassChange }) {
    const { t } = useTranslation(); // Initialize the translation function
    const [passCategories, setPassCategories] = useState([]);
    const [selectedPasses, setSelectedPasses] = useState([]);

    useEffect(() => {
        api.get('/passlist/')
            .then(response => {
                const fetchedPasses = ['Non-classifié', ...response.data]; //Add "Non-classifié" to the list
                setPassCategories(fetchedPasses);
                setSelectedPasses(fetchedPasses); //Select all by default
                onPassChange(fetchedPasses); //Pass all selected passes (including "Non-classifié")
            })
            .catch(error => {
                console.error('Error fetching pass categories', error);
            });
    }, []);

    const handlePassChange = (pass) => {
        // Toggle selection of the pass
        const newSelectedPasses = selectedPasses.includes(pass)
            ? selectedPasses.filter(p => p !== pass)
            : [...selectedPasses, pass];

        setSelectedPasses(newSelectedPasses);
        onPassChange(newSelectedPasses); //Pass selected passes to parent
    };

    const handleSelectAll = () => {
        if (selectedPasses.length === passCategories.length) {
            setSelectedPasses([]);
            onPassChange([]);
        } else {
            setSelectedPasses(passCategories);
            onPassChange(passCategories);
        }
    };

    return (
        <Accordion className="shadow-sm">
            <Accordion.Item eventKey="0">
                <Accordion.Header>{t('accordion.passCategory')}</Accordion.Header> {/* Use translation */}
                <Accordion.Body>
                    <Form.Check
                        type="checkbox"
                        label={selectedPasses.length === passCategories.length ? t('accordion.deselectAll') : t('accordion.selectAll')}
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