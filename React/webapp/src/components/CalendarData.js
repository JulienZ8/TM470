import React, { useState, useEffect } from 'react'; // React components
import axios from 'axios';

function CalendarData() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/calendar/')
            .then(response => {
                setData(response.data); // Assuming the data is returned as an array
            })
            .catch(error => {
                console.error('Error fetching the data from API', error);
            });
    }, []);

    return (
        <div>
            <h1>Calendar Data from FastAPI:</h1>
            <ul>
                {data.map((item, index) => (
                    <li key={index}>
                        Year: {item.year_number}, Season: {item.season}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CalendarData;

