import React from 'react';
import EntriesChart from './components/EntriesChart';
import Menu from './components/Menu';

function App() {
    return (
        <div className="app-container" style={{ display: 'flex', height: '100vh' }}>
            <div className="menu-container" style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
                <Menu />
            </div>
            <div className="chart-container" style={{ flex: 4, padding: '20px' }}>
                <EntriesChart />
            </div>
        </div>
    );
}

export default App;