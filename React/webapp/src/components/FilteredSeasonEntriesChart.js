import React, { useState, useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../api'; // Import your Axios instance

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AggregatedSeasonEntriesChart() {
    const [seasonEntries, setSeasonEntries] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        api.get('/factentry-aggregated/')
            .then(response => {
                setSeasonEntries(response.data);
            })
            .catch(error => {
                console.error('Error fetching aggregated season entries', error);
                setError('Failed to load data');
            });
    };

    const chartData = useMemo(() => {
        const groupedData = {};

        seasonEntries.forEach(entry => {
            const season = entry.season_name;
            const period = entry.period_default;
            const entryCount = entry.total_entries;

            if (!groupedData[season]) {
                groupedData[season] = {};
            }

            groupedData[season][period] = entryCount;
        });

        const seasons = Object.keys(groupedData);
        const periods = [...new Set(seasonEntries.map(item => item.period_default))];

        const datasets = periods.map(period => ({
            label: period,
            data: seasons.map(season => groupedData[season][period] || 0),
            backgroundColor: getRandomColor(),
            borderColor: getRandomColor(),
            borderWidth: 1,
        }));

        return {
            labels: seasons,
            datasets: datasets,
        };
    }, [seasonEntries]);

    const options = {
        scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    title: (context) => `Season: ${context[0].label}`,
                    label: (context) => {
                        const period = context.dataset.label;
                        const entryCount = context.raw;
                        return [
                            `Period: ${period}`,
                            `Total Entries: ${entryCount}`,
                        ];
                    },
                },
            },
        },
    };

    return (
        <div>
            <h2>Aggregated Season Entries Chart</h2>
            {error ? <p>{error}</p> : <Bar data={chartData} options={options} />}
        </div>
    );
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export default AggregatedSeasonEntriesChart;
