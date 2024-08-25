import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, ChartDataLabels);

function ComparisonLineChart({ filteredData, referenceSeason }) {
    const comparisonData = useMemo(() => {
        if (!referenceSeason || filteredData.length === 0) {
            return [];
        }

        // Calculate the total entries for the reference season from filtered data
        const totalReference = filteredData
            .filter(entry => entry.season_name === referenceSeason)
            .reduce((total, entry) => total + entry.entry_count, 0);

        // Group filtered data by season and calculate the percentage difference
        const groupedData = filteredData.reduce((acc, entry) => {
            if (!acc[entry.season_name]) {
                acc[entry.season_name] = 0;
            }
            acc[entry.season_name] += entry.entry_count;
            return acc;
        }, {});

        return Object.keys(groupedData).map(season => {
            const percentage = totalReference > 0 ? ((groupedData[season] - totalReference) / totalReference) * 100 : 0;
            return {
                season_name: season,
                percentage,
            };
        });
    }, [filteredData, referenceSeason]);

    const chartData = {
        labels: comparisonData.map(entry => entry.season_name),  // X-axis labels (seasons)
        datasets: [
            {
                label: `Comparison with ${referenceSeason}`,
                data: comparisonData.map(entry => entry.percentage),  // Y-axis data (percentage difference)
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1,
            },
        ],
    };

    const options = {    
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value + '%';  // Add '%' to y-axis labels
                    },
                },
            },
            x: {
                beginAtZero: true,
                ticks: {
                    autoSkip: false,  // Ensures that all seasons are displayed
                },
            },
        },
        plugins: {
            datalabels: {
                display: true,  // Show data labels
                color: 'black',  // Label color
                align: 'top',  // Align labels on top of the points
                anchor: 'end',  // Anchor the labels to the end of the point
                formatter: (value) => `${Math.round(value)}%`,  // Format percentage to 2 decimal places
            },
        },
    };

    return (
        <div>
            <h2>Comparaison avec la saison de référence</h2>
            <Line data={chartData} options={options} />
        </div>
    );
}

export default ComparisonLineChart;


