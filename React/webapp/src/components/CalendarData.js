import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CalendarData() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/calendar/')
            .then(response => {
                console.log('Data received:', response.data); // Check the logged data structure
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching the data from API', error);
            });
    }, []);

    return (
        <div>
            <h1>Calendar Data from FastAPI:</h1>
            {data.length > 0 ? (
                <ul>
                    {data.map((item, index) => (
                        <li key={index}>
                            Period: {item.period_default}, Season: {item.season_name}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No data received. Check the console for errors.</p>
            )}
        </div>
    );
}

export default CalendarData;