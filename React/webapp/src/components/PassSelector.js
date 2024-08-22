import React, { useState, useEffect } from 'react';
import api from '../api';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';

function PassSelector({ onPassChange }) {
    const [passCategories, setPassCategories] = useState([]); //useState to store list of pass categories fetched from the API
    const [selectedPass, setSelectedPass] = useState('All'); //useState to store the currently selected pass category, defaulting to 'All'
    //const [isOpen, setIsOpen] = useState(false); //useState to manage the open/close status of the dropdown menu

    // useEffect to fetch pass categories from the API when the component mounts
    useEffect(() => {
        api.get('/passlist/')
            .then(response => {
                setPassCategories(['All', 'Non-classifié', ...response.data]); //Prepend 'All' add 'Non-classifié' to the list of categories
            })
            .catch(error => {
                console.error('Error fetching pass categories', error);
            });
    }, []);  //Empty dependency array means this effect runs only once, after the initial render

    //Function to handle pass category selection
    const handlePassChange = (pass) => {
        setSelectedPass(pass);  //Update the selected pass state
        onPassChange(pass === 'Non-classifié' ? null : pass);  // Notify the parent component, using null for "Non-classifié"
    };

    return (       
        <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Catégorie de forfait</Accordion.Header>
                <Accordion.Body>
                    {/* Loop over the pass categories to create a checkbox for each */}
                    {passCategories.map((pass, index) => (
                        <Form.Check
                            key={index}
                            type="radio"
                            label={pass}
                            checked={selectedPass === pass}
                            onChange={() => handlePassChange(pass)}
                        />
                    ))}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default PassSelector;
