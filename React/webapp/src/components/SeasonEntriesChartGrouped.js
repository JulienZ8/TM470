import React, { useState, useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SeasonEntriesChartGrouped({ selectedPeriods = [], selectedSeasonNames = [], selectedEteHiver = [], selectedPass = 'All', onFilteredDataChange }) {
    const [seasonEntries, setSeasonEntries] = useState([]);
    const [error, setError] = useState(null);
    const [colorMap, setColorMap] = useState({});  // Initialize color map state

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
        const filtered = seasonEntries.filter(entry => 
            selectedPeriods.includes(entry.period_default) &&
            selectedSeasonNames.includes(entry.season_name) &&
            selectedEteHiver.includes(entry.season) &&
            (selectedPass === 'All' || entry.pass_category === selectedPass)
        );
        console.log("Filtered Entries:", filtered); // Debugging line
        
        // Pass the filtered data to the parent via callback
        onFilteredDataChange(filtered);

        return filtered;
    }, [seasonEntries, selectedPeriods, selectedSeasonNames, selectedEteHiver, selectedPass]);

    const chartData = useMemo(() => {
        const groupedData = {};
        const newColorMap = { ...colorMap };  // Create a copy of the current color map

        filteredSeasonEntries.forEach(entry => {
            const season = entry.season_name;
            const period = entry.period_default;
            const entryCount = entry.entry_count;

            if (!groupedData[season]) {
                groupedData[season] = {};
            }

            groupedData[season][period] = (groupedData[season][period] || 0) + entryCount;

            if (!newColorMap[period]) {
                newColorMap[period] = getRandomColor();
            }
        });

        setColorMap(newColorMap);

        const seasons = Object.keys(groupedData);
        const datasets = selectedPeriods.map(period => ({
            label: period,
            data: seasons.map(season => groupedData[season][period] || 0),
            backgroundColor: newColorMap[period],  
            borderColor: newColorMap[period],  
            borderWidth: 0,
        }));

        return {
            labels: seasons,
            datasets: datasets,
        };
    }, [filteredSeasonEntries, selectedPeriods]);

    const options = {
        responsive: true,  // Enable responsiveness
        maintainAspectRatio: true,  // Disable maintaining the aspect ratio
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
                        // Calculate the total entries for the hovered season
                        const seasonTotal = filteredSeasonEntries
                            .filter(entry => entry.season_name === context.label)
                            .reduce((total, entry) => total + entry.entry_count, 0);

                        return [
                            `Period: ${period}`,
                            `Entries: ${entryCount}`,
                            `Total: ${seasonTotal}`,
                        ];
                    },
                },
            },
        },
    };

    return (
        <div>
            <h2>Premières entrées</h2>
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