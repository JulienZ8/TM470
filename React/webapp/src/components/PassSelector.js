import React, { useState, useEffect } from 'react';
import api from '../api';

function PassSelector({ onPassChange }) {
    const [passCategories, setPassCategories] = useState([]);
    const [selectedPass, setSelectedPass] = useState('All');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        api.get('/passlist/')
            .then(response => {
                setPassCategories(['All', ...response.data]);
                setSelectedPass('All'); // Default to 'All'
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
        <div>
            <button onClick={() => setIsOpen(!isOpen)}>
                Catégorie de forfait
            </button>
            {isOpen && (
                <div className="dropdown">
                    {passCategories.map((pass, index) => (
                        <div key={index}>
                            <label>
                                <input
                                    type="radio"
                                    checked={selectedPass === pass}
                                    onChange={() => handlePassChange(pass)}
                                />
                                {pass}
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PassSelector;
