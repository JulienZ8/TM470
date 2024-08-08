import React from 'react';
import CalendarData from './components/CalendarData';
import ChartTest from './components/chart_test'

function App() {
  return (

    <div className="App">
      <header className="App-header">
        <p>
          Calendar Data from FastAPI:
        </p>
      </header>
      <ChartTest />
      <CalendarData />
    </div>
  );
}

export default App;

