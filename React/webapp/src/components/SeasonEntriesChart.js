import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SeasonEntriesChart() {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Total Entries by Season',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        }]
    });

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/season-entries/')
            .then(response => {
                const labels = response.data.map(item => item.season_name);
                const data = response.data.map(item => item.total_entries);
                setChartData({
                    labels: labels,
                    datasets: [{
                        ...chartData.datasets[0],
                        data: data
                    }]
                });
            })
            .catch(error => console.error('Error fetching season entries', error));
    }, []);

    return (
        <div>
            <h2>Season Entries Chart</h2>
            <Bar data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />
        </div>
    );
}

export default SeasonEntriesChart;
