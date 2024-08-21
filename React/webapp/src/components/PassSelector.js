import React, { useState, useEffect } from 'react';
import api from '../api';
import { Dropdown, DropdownButton, Form } from 'react-bootstrap';

function PassSelector({ onPassChange }) {
    const [passCategories, setPassCategories] = useState([]);
    const [selectedPass, setSelectedPass] = useState('All');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        api.get('/passlist/')
            .then(response => {
                setPassCategories(['All', ...response.data]);  // Include 'All' option
            })
            .catch(error => {
                console.error('Error fetching pass categories', error);
            });
    }, []);

    const handlePassChange = (pass) => {
        setSelectedPass(pass);
        onPassChange(pass);
    };

    return (
        <Dropdown className="d-inline mx-2" autoClose="outside" show={isOpen} onToggle={() => setIsOpen(!isOpen)}>
            <Dropdown.Toggle id="dropdown-autoclose-outside">
                Catégorie de forfait
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {passCategories.map((pass, index) => (
                    <Dropdown.Item as="button" key={index} onClick={() => handlePassChange(pass)}>
                        <Form.Check
                            type="radio"
                            label={pass}
                            checked={selectedPass === pass}
                            onChange={() => handlePassChange(pass)}
                        />
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default PassSelector;
