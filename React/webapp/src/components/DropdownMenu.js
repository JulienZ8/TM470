import React from 'react';

function DropdownMenu({ label, isOpen, onToggle, children, style }) {
    return (
        <div style={style}>
            <button onClick={onToggle}>{label}</button>
            {isOpen && <div>{children}</div>}
        </div>
    );
}

export default DropdownMenu;
