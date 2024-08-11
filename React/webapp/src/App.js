import React from 'react';
import CalendarData from './components/CalendarData';
import SeasonEntriesChart from './components/SeasonEntriesChart';


function App() {
  return (

    <div className="App">
      <header className="App-header">
        <p>
          Calendar Data from FastAPI:
        </p>
      </header>
      <SeasonEntriesChart />
      <CalendarData />
    </div>
  );
}

export default App;

