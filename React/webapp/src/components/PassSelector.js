import React, { useContext, useState, useEffect } from 'react';
import api from '../api';
import { Form } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import { useTranslation } from 'react-i18next';  // Import the useTranslation hook

function PassSelector({ onPassChange }) {
    const { t } = useTranslation(); // Initialize the translation function
    const [passCategories, setPassCategories] = useState([]); //State to hold the list of seasons fetched from the API
    const [selectedPasses, setSelectedPasses] = useState([]); //State to hold the currently selected pass

    useEffect(() => {
        api.get('/passlist/')
            .then(response => {
                const fetchedPasses = ['Non-classifié', ...response.data]; //Add "Non-classifié" to the list
                setPassCategories(fetchedPasses); //Store fetched seasons in state
                setSelectedPasses(fetchedPasses); //Select all by default
                onPassChange(fetchedPasses); //Notify parent component with initial selection
            })
            .catch(error => {
                console.error('Error fetching pass categories', error);
            });
    }, []);

    const handlePassChange = (pass) => { //Handle the selection/deselection of a single pass
        const newSelectedPasses = selectedPasses.includes(pass) // Toggle selection of the pass
            ? selectedPasses.filter(p => p !== pass)
            : [...selectedPasses, pass];

        setSelectedPasses(newSelectedPasses);
        onPassChange(newSelectedPasses); //Pass selected passes to parent
    };

    const handleSelectAll = () => { //Handle the "Select All" or "Deselect All" functionality
        if (selectedPasses.length === passCategories.length) {
            setSelectedPasses([]);
            onPassChange([]);
        } else { //Otherwise, select all seasons
            setSelectedPasses(passCategories);
            onPassChange(passCategories);
        }
    };

    return (
        <Accordion className="shadow-sm"> {/* Accordion with a shadow */}
            <Accordion.Item eventKey="0"> {/* Single Accordion item */}
                <Accordion.Header>{t('accordion.passCategory')}</Accordion.Header> {/* Use translation */}
                <Accordion.Body>
                    <Form.Check    //Select All / Deselect all checkbox
                        type="checkbox"
                        label={selectedPasses.length === passCategories.length ? t('accordion.deselectAll') : t('accordion.selectAll')}
                        checked={selectedPasses.length === passCategories.length}
                        onChange={handleSelectAll}
                    />
                    {passCategories.map((pass, index) => (
                        <Form.Check   //Pass selection checkboxes
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