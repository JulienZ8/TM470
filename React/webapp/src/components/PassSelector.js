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
                setPassCategories(['All', ...response.data]); //Prepend 'All' to the list of categories to allow selecting all passes
            })
            .catch(error => {
                console.error('Error fetching pass categories', error);
            });
    }, []);  //Empty dependency array means this effect runs only once, after the initial render

    //Function to handle pass category selection
    const handlePassChange = (pass) => {
        setSelectedPass(pass);  //Update the selected pass state
        onPassChange(pass);  //Notify the parent component of the selected pass
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
/*
<Dropdown className="d-inline mx-2" autoClose="outside"> 
<Dropdown.Toggle id="dropdown-autoclose-outside">
Catégorie de forfait
</Dropdown.Toggle>
<Dropdown.Menu>
{passCategories.map((pass, index) => (
    <Dropdown.Item 
        as="button" 
        key={index} 
        onClick={() => handlePassChange(pass)}  //Handle item selection
    >
        <Form.Check
            type="radio"  //radio button to allow single selection
            label={pass}  //Display the pass category name
            checked={selectedPass === pass}  //Check if this pass is selected
            onChange={() => handlePassChange(pass)}  //Handle changes in selection
        />
    </Dropdown.Item>
))}
</Dropdown.Menu>
</Dropdown>
*/