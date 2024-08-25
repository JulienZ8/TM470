import React, { useState, useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../api'; // Import the API instance for making requests

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function EntriesChart() {
    // State to store the entries fetched from the API
    const [entries, setEntries] = useState([]);

    // useEffect to fetch data from the API when the component mounts
    useEffect(() => {
        api.get('/entries/') // Fetch data from the API endpoint
            .then(response => {
                setEntries(response.data); // Store the fetched data in state
            })
            .catch(error => {
                console.error('Error fetching entries', error); // Handle errors
            });
    }, []); // Empty dependency array ensures this effect runs only once when the component mounts

    // Memorize the processed chart data to avoid recalculating on every render
    const chartData = useMemo(() => {
        const groupedData = {};

        // Group data by season_name and period_default
        entries.forEach(entry => {
            const season = entry.dim_calendar.season_name;
            const period = entry.dim_calendar.period_default;

            if (!groupedData[season]) {
                groupedData[season] = {};
            }

            if (!groupedData[season][period]) {
                groupedData[season][period] = 0;
            }

            groupedData[season][period] += 1; // Increment the count for each period within the season
        });

        // Prepare data for the chart
        const seasons = Object.keys(groupedData);
        const periods = [...new Set(entries.map(entry => entry.dim_calendar.period_default))];

        const datasets = periods.map(period => ({
            label: period,
            data: seasons.map(season => groupedData[season][period] || 0),
            backgroundColor: getRandomColor(), // Random color for each dataset
        }));

        return {
            labels: seasons,
            datasets: datasets,
        };
    }, [entries]); // Recompute chartData only when entries change

    // Chart options for stacked bar chart
    const options = {
        scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true },
        },
    };

    return (
        <div>
            <h2>Season Entries Chart Grouped</h2>
            <Bar data={chartData} options={options} /> {/* Render the chart */}
        </div>
    );
}

// Helper function to generate random colors
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export default EntriesChart;
