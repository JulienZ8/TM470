import React, { useState } from 'react';

function DropdownMenu({ label, children }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div style={{ position: 'relative', textAlign: 'left', marginBottom: '10px' }}>
            <button onClick={toggleDropdown} style={{ padding: '10px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px' }}>
                {label}
            </button>
            {isOpen && (
                <div style={{ 
                    position: 'absolute', 
                    left: 0, 
                    top: '100%', 
                    background: 'white', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px', 
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', 
                    zIndex: 1000, 
                    padding: '10px' 
                }}>
                    {children}
                </div>
            )}
        </div>
    );
}

export default DropdownMenu;
