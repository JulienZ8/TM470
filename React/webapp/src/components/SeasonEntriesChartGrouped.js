import React, { useState, useEffect, useMemo } from 'react'; // Import necessary React hooks
import { Bar } from 'react-chartjs-2'; // Import the Bar component from react-chartjs-2 to create bar charts
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // Import necessary Chart.js components
import api from '../api'; // Import the custom axios instance for API calls

// Register the required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SeasonEntriesChartGrouped() {
    // React state hooks to store the season entries data and handle errors
    const [seasonEntries, setSeasonEntries] = useState([]);
    const [error, setError] = useState(null);

    // useEffect hook to fetch data from the backend when the component mounts
    useEffect(() => {
        api.get('/season-entries-grouped/') // API call to fetch grouped season entries
            .then(response => {
                setSeasonEntries(response.data); // Update state with the fetched data
            })
            .catch(error => {
                console.error('Error fetching season entries', error); // Log any errors
                setError('Failed to load data'); // Update state with the error message
            });
    }, []); // Empty dependency array ensures this effect runs only once when the component mounts

    // useMemo hook to process data for the chart only when seasonEntries changes
    const chartData = useMemo(() => {
        const groupedData = {}; // Object to store data grouped by season_name and period_default

        // Iterate over the fetched season entries data to group them
        seasonEntries.forEach(entry => {
            const season = entry.season_name; // Extract season_name from the current entry
            const period = entry.period_default; // Extract period_default from the current entry
            const entryCount = entry.entry_count; // Extract entry_count from the current entry

            // Initialize the season in groupedData if it doesn't exist
            if (!groupedData[season]) {
                groupedData[season] = {};
            }

            // Directly assign the entry count for the specific period within the season
            groupedData[season][period] = entryCount;
        });

        // Extract the unique season names for the x-axis labels
        const seasons = Object.keys(groupedData);
        // Extract the unique period names for the dataset labels
        const periods = [...new Set(seasonEntries.map(item => item.period_default))];

        // Create datasets for each period
        const datasets = periods.map(period => ({
            label: period, // The label for this dataset (period)
            data: seasons.map(season => groupedData[season][period] || 0), // Data points for each season
            backgroundColor: getRandomColor(), // Random background color for each period
            borderColor: getRandomColor(), // Random border color for each period
            borderWidth: 0, // Border width of 1 for the bars
        }));

        // Return the structured data for the chart
        return {
            labels: seasons, // The x-axis labels (season names)
            datasets: datasets, // The datasets (one for each period)
        };
    }, [seasonEntries]); // Recalculate the chart data only when seasonEntries changes

    // Chart.js options to configure the appearance and behavior of the chart
    const options = {
        scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    title: (context) => `Saison: ${context[0].label}`,
                    label: (context) => {
                        // Access the data point directly
                        const period = context.dataset.label; // Get the period_default
                        const entryCount = context.raw; // Get the entries_count for this period
                        const seasonEntry = seasonEntries.find(
                            entry => entry.season_name === context.label && entry.period_default === period
                        );
                        const totalEntries = seasonEntry.total_entries;
                        return [
                            `period_default: ${period}`,
                            `entries_count: ${entryCount}`,
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
            {/* Display the chart or an error message */}
            {error ? <p>{error}</p> : <Bar data={chartData} options={options} />}
        </div>
    );
}

// Helper function to generate random colors for the chart datasets
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export default SeasonEntriesChartGrouped; // Export the component for use in other parts of the application


