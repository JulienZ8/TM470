import React, { useState, useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../api';  // Adjust the import path if necessary

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SeasonEntriesChart() {
    const [seasonEntries, setSeasonEntries] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('/season-entries/')
            .then(response => {
                setSeasonEntries(response.data);
            })
            .catch(error => {
                console.error('Error fetching season entries', error);
                setError('Failed to load data');
            });
    }, []);

    const chartData = useMemo(() => ({
        labels: seasonEntries.map(item => item.season_name),
        datasets: [{
            label: 'Total Entries by Season',
            data: seasonEntries.map(item => item.total_entries),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        }]
    }), [seasonEntries]);

    return (
        <div>
            <h2>Season Entries Chart</h2>
            {error ? <p>{error}</p> : <Bar data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />}
        </div>
    );
}

export default SeasonEntriesChart;