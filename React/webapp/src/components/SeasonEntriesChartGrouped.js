import React, { useState, useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Card from 'react-bootstrap/Card';
import api from '../api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

function SeasonEntriesChartGrouped({ 
    selectedPeriods = [], 
    selectedSeasonNames = [], 
    selectedEteHiver = [], 
    selectedPasses = [], 
    onFilteredDataChange 
}) {
    const [seasonEntries, setSeasonEntries] = useState([]); //Holds fetched data
    const [error, setError] = useState(null); //Handles errors during fetching
    const [colorMap, setColorMap] = useState({}); //Manages color mapping for periods
    const [periodOrder, setPeriodOrder] = useState([]); //Captures the initial period order

    useEffect(() => { //useEffect to fetch data from the API when the component mounts
        api.get('/season-entries-grouped/')
            .then(response => {
                setSeasonEntries(response.data); //Store the fetched data in state
                console.log("Season Entries Fetched:", response.data);
                // Capture the initial period order from the data (only on first load)
                const initialPeriods = Array.from(
                    new Set(response.data.map(entry => entry.period_default))
                );
                setPeriodOrder(initialPeriods);
            })
            .catch(error => {
                console.error('Error fetching season entries', error);
                setError('Failed to load data'); // Set error state if there's a problem fetching data
            });
    }, []); //Empty dependency array ensures this only runs once when the component mounts

    const filteredSeasonEntries = useMemo(() => { //useMemo to filter the season entries
        const filtered = seasonEntries.filter(entry =>
            selectedPeriods.includes(entry.period_default) &&
            selectedSeasonNames.includes(entry.season_name) &&
            selectedEteHiver.includes(entry.season) &&
            (selectedPasses.includes(entry.pass_category) || 
             (entry.pass_category === null && selectedPasses.includes('Non-classifié')))
        );
 
        return filtered; //Return filtered data for rendering purposes
    }, [seasonEntries, selectedPeriods, selectedSeasonNames, selectedEteHiver, selectedPasses]);

    useEffect(() => { //Trigger onFilteredDataChange from useEffect, not during render
        onFilteredDataChange(filteredSeasonEntries); //Update local filtered entries
    }, [filteredSeasonEntries, onFilteredDataChange]); //Pass filtered data to parent component

    //Update colorMap in a separate useEffect after data has been fetched and filteredSeasonEntries is available
    useEffect(() => {
        const newColorMap = { ...colorMap };

        //Go through filtered season entries and assign colors to periods
        filteredSeasonEntries.forEach(entry => {
            const period = entry.period_default;
            if (!newColorMap[period]) {
                newColorMap[period] = getRandomColor(); //Assign random color if not already set
            }
        });

        if (JSON.stringify(newColorMap) !== JSON.stringify(colorMap)) { //Set the updated color map only if it has changed
            setColorMap(newColorMap); //Update the state only if necessary
        }
    }, [filteredSeasonEntries, colorMap]); //Depend on filtered data and color map

    const chartData = useMemo(() => { //Chart data creation
        const groupedData = {};

        filteredSeasonEntries.forEach(entry => {
            const season = entry.season_name;
            const period = entry.period_default;
            const entryCount = entry.entry_count;

            if (!groupedData[season]) {
                groupedData[season] = {};
            }

            groupedData[season][period] = (groupedData[season][period] || 0) + entryCount;
        });

        const seasons = Object.keys(groupedData);

        const datasets = periodOrder.map(period => ({ //Create datasets for all periods in the captured initial order
            label: period,
            data: seasons.map(season => groupedData[season][period] || 0),
            backgroundColor: colorMap[period],
            borderColor: colorMap[period],
            borderWidth: 0,
        }));

        return {
            labels: seasons,
            datasets: datasets,
        };
    }, [filteredSeasonEntries, periodOrder, selectedPeriods, colorMap]);

    const options = { //Chart options for stacked bar chart
        responsive: true,
        aspectRatio: 3,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true, //Stack bars on the x-axis
                grid: { display: false },
            },
            y: {
                stacked: true, //Stack bars on the y-axis
                beginAtZero: true,
                grid: { display: false },
            },
        },
        plugins: {
            tooltip: {
                callbacks: { //customize the Tooltip label (pop-up when hovering over chart)
                    title: (context) => `Season: ${context[0].label}`,
                    label: (context) => {
                        const period = context.dataset.label;
                        const entryCount = context.raw.toLocaleString();
                        const seasonTotal = filteredSeasonEntries  //Calculate the total entries for the hovered season
                            .filter(entry => entry.season_name === context.label)
                            .reduce((total, entry) => total + entry.entry_count, 0)
                            .toLocaleString();

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
                    const barHeight = Math.abs(yAxis.getPixelForValue(0) - yAxis.getPixelForValue(value));
                    const minBarHeight = 20;

                    return context.datasetIndex === context.chart.data.datasets.length - 1 || barHeight > minBarHeight;
                },
                align: function (context) { //Align totals at the end (top of the stack) and individual values in the center
                    return context.datasetIndex === context.chart.data.datasets.length - 1 ? 'end' : 'center';
                },
                anchor: function (context) { //Anchor totals at the end and individual values in the center
                    return context.datasetIndex === context.chart.data.datasets.length - 1 ? 'end' : 'center';
                },
                formatter: (value, context) => {
                    if (context.datasetIndex === context.chart.data.datasets.length - 1) {
                        const stackTotal = context.chart.data.datasets.reduce((total, dataset) => {
                            return total + dataset.data[context.dataIndex];
                        }, 0);
                        return stackTotal.toLocaleString(); //Display the stack total at the top of the stack
                    } else {
                        return value.toLocaleString(); //Display the individual stack total within the bar
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

function getRandomColor() { //Function to generate random color for each period
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export default SeasonEntriesChartGrouped;