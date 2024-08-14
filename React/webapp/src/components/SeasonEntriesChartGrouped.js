import React, { useState, useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SeasonEntriesChartGrouped({ selectedPeriods = [], selectedSeasons = [], selectedSeasonNames = [] }) {
    const [seasonEntries, setSeasonEntries] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('/season-entries-grouped/')
            .then(response => {
                setSeasonEntries(response.data);
            })
            .catch(error => {
                console.error('Error fetching season entries', error);
                setError('Failed to load data');
            });
    }, []);

    const filteredSeasonEntries = useMemo(() => {
        return seasonEntries.filter(entry => 
            (selectedPeriods.length === 0 || selectedPeriods.includes(entry.period_default)) &&
            (selectedSeasons.length === 0 || selectedSeasons.includes(entry.season_name)) &&
            (selectedSeasonNames.length === 0 || selectedSeasonNames.includes(entry.season))
        );
    }, [seasonEntries, selectedPeriods, selectedSeasons, selectedSeasonNames]);

    const chartData = useMemo(() => {
        const groupedData = {};

        filteredSeasonEntries.forEach(entry => {
            const season = entry.season_name;
            const period = entry.period_default;
            const entryCount = entry.entry_count;

            if (!groupedData[season]) {
                groupedData[season] = {};
            }

            groupedData[season][period] = entryCount;
        });

        const seasons = Object.keys(groupedData);
        const datasets = selectedPeriods.map(period => ({
            label: period,
            data: seasons.map(season => groupedData[season][period] || 0),
            backgroundColor: getRandomColor(),
            borderColor: getRandomColor(),
            borderWidth: 0,
        }));

        return {
            labels: seasons,
            datasets: datasets,
        };
    }, [filteredSeasonEntries, selectedPeriods]);

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
                        const seasonEntry = filteredSeasonEntries.find(
                            entry => entry.season_name === context.label && entry.period_default === period
                        );
                        const totalEntries = seasonEntry.total_entries;
                        return [
                            `Period: ${period}`,
                            `Entries: ${entryCount}`,
                            `Total: ${totalEntries}`,
                        ];
                    },
                },
            },
        },
    };

    return (
        <div>
            <h2>Season Entries Chart Grouped</h2>
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

export default SeasonEntriesChartGrouped;
