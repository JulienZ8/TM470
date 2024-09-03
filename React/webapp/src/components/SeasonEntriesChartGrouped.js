import React, { useState, useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Labels } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Card from 'react-bootstrap/Card';
import api from '../api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

function SeasonEntriesChartGrouped({ selectedPeriods = [], selectedSeasonNames = [], selectedEteHiver = [], selectedPasses = [], onFilteredDataChange }) {
    const [seasonEntries, setSeasonEntries] = useState([]); //State to hold the data fetched from the API
    const [error, setError] = useState(null); //State to handle any errors during data fetching
    const [colorMap, setColorMap] = useState({}); //State to manage the color mapping for different periods

    useEffect(() => { //useEffect to fetch data from the API when the component mounts
        api.get('/season-entries-grouped/')
            .then(response => {
                setSeasonEntries(response.data); //Store the fetched data in state
            })
            .catch(error => {
                console.error('Error fetching season entries', error);
                setError('Failed to load data'); // Set error state if there's a problem fetching data
            });
    }, []);

    
    const filteredSeasonEntries = useMemo(() => { //useMemo to memoize the filtered season entries, recalculating only when dependencies change   
        const filtered = seasonEntries.filter(entry => 
            selectedPeriods.includes(entry.period_default) &&
            selectedSeasonNames.includes(entry.season_name) &&
            selectedEteHiver.includes(entry.season) &&
            (selectedPasses.includes(entry.pass_category) || 
             (entry.pass_category === null && selectedPasses.includes('Non-classifié')))
        );
    
        console.log("Filtered Entries:", filtered); 
        onFilteredDataChange(filtered);  // Pass the filtered data up to the parent component
    
        return filtered;
    }, [seasonEntries, selectedPeriods, selectedSeasonNames, selectedEteHiver, selectedPasses]);

    const chartData = useMemo(() => { //useMemo to prepare data for the chart based on filtered entries
        const groupedData = {};
        const newColorMap = { ...colorMap }; //Clone the current color map

        filteredSeasonEntries.forEach(entry => {
            const season = entry.season_name;
            const period = entry.period_default;
            const entryCount = entry.entry_count;
            
            if (!groupedData[season]) { //Group data by season and period
                groupedData[season] = {};
            }

            groupedData[season][period] = (groupedData[season][period] || 0) + entryCount; //Sum entry counts for each period within a season

            if (!newColorMap[period]) { //Assign a color to each period if not already assigned
                newColorMap[period] = getRandomColor();
            }
        });

        setColorMap(newColorMap); //Update the color map state

        const seasons = Object.keys(groupedData); //Extract season names and prepare datasets for the chart
        const datasets = selectedPeriods.map(period => ({
            label: period,
            data: seasons.map(season => groupedData[season][period] || 0),
            backgroundColor: newColorMap[period],
            borderColor: newColorMap[period],
            borderWidth: 0,
        }));

        return {
            labels: seasons, //X-axis labels (season names)
            datasets: datasets, //Data for each period
        };
    }, [filteredSeasonEntries, selectedPeriods]);

    const options = { // Chart.js options for customization
        responsive: true,
        aspectRatio: 3,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true, //Stack bars on the x-axis
                grid: {
                    display: false, //Hide grid lines on the x-axis
                },

            },
            y: {
                stacked: true, //Stack bars on the y-axis
                beginAtZero: true, //Start y-axis at zero
                grid: {
                    display: false, //Hide grid lines on the y-axis
                },

            },
        },
        plugins: {
            tooltip: {
                callbacks: { //customize the Tooltip label (pop-up when hovering over chart)
                    title: (context) => `Season: ${context[0].label}`,
                    label: (context) => {
                        const period = context.dataset.label;
                        const entryCount = context.raw;
                        const seasonTotal = filteredSeasonEntries  //Calculate the total entries for the hovered season
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
            datalabels: {
                display: function(context) {
                    const dataset = context.dataset;
                    const value = dataset.data[context.dataIndex];
                    const yAxis = context.chart.scales.y;
                    
                    const barHeight = Math.abs(yAxis.getPixelForValue(0) - yAxis.getPixelForValue(value)); //Calculate the bar height
            
                    const minBarHeight = 20; //Minimum height threshold for displaying text within the stack
            
                    //Always display total at the top, and individual values if bar is tall enough
                    return context.datasetIndex === context.chart.data.datasets.length - 1 || barHeight > minBarHeight;
                },
                align: function(context) {
                    //Align totals at the end (top of the stack) and individual values in the center
                    return context.datasetIndex === context.chart.data.datasets.length - 1 ? 'end' : 'center';
                },
                anchor: function(context) {
                    //Anchor totals at the end and individual values in the center
                    return context.datasetIndex === context.chart.data.datasets.length - 1 ? 'end' : 'center';
                },
                formatter: (value, context) => {
                    if (context.datasetIndex === context.chart.data.datasets.length - 1) {
                        const stackTotal = context.chart.data.datasets.reduce((total, dataset) => { //Calculate the stack total for the top stack
                            return total + dataset.data[context.dataIndex];
                        }, 0);
                        return stackTotal; //Display the stack total at the top of the stack
                    } else {
                        return value; //Display the individual stack total within the bar
                    }
                },
                font: function(context) {
                    return { //Bold font for totals, normal for individual values
                        weight: context.datasetIndex === context.chart.data.datasets.length - 1 ? 'bold' : 'normal',
                        size: 12,
                    };
                },
                color: '#000',  //Text color
            },
            legend: {
                labels: {
                    usePointStyle: true, //Use the pointStyle property
                    pointStyle: 'circle', //Set the point style to circle
                },
            },
        },
    };

    return (
        
        <Card className="shadow-sm"> {/* Bootstrap Card component with a shadow */}
            <Card.Header as="h5">Premières entrées</Card.Header>
            <Card.Body>
                <div className="chart-container">
                {error ? <p>{error}</p> : <Bar data={chartData} options={options} />}
                </div>
            </Card.Body>
        </Card>
        
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