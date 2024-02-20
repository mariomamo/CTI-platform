import React from "react";
import { Line } from "react-chartjs-2";
const LineChart = ({ chartData }) => {
    const chartOptions = {
        plugins: {
            legend: {
                display: false
            }
        },
        maintainAspectRatio: true,
        responsive: true,
        tooltips: {
            enabled: false,
            custom: false
        },
        elements: {
            point: {
                radius: 0
            },
            line: {
                tension: 0.33
            }
        },
        scales: {
            // to remove the labels
            x: {
                ticks: {
                    display: false,
                },

                // to remove the x-axis grid
                grid: {
                    drawBorder: false,
                    display: false,
                },
            },
            // to remove the y-axis labels
            y: {
                ticks: {
                    display: false,
                    beginAtZero: true,
                },
                // to remove the y-axis grid
                grid: {
                    drawBorder: false,
                    display: false,
                },
            },
        }
    }

    return (
        <div style={{width: "110%", position: "absolute", left: -10, bottom: -10}} className="chart-container">
            <Line
                data={chartData}
                options={chartOptions}
            />
        </div>
    );
}
export default LineChart;