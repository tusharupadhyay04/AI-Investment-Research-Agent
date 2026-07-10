import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ScoreChart = ({ score }) => {
  const numericScore = typeof score === 'number' ? score : parseInt(score, 10) || 0;
  const remainder = 100 - numericScore;

  let color = '#3b82f6'; // blue
  if (numericScore >= 70) color = '#10b981'; // emerald
  if (numericScore < 40) color = '#f43f5e'; // rose

  const data = {
    labels: ['Score', 'Remaining'],
    datasets: [
      {
        data: [numericScore, remainder],
        backgroundColor: [color, 'rgba(255, 255, 255, 0.2)'], // Fill color and empty slate color
        borderColor: ['transparent', 'transparent'],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
        cutout: '80%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className="relative h-40 w-full flex items-center justify-center">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
        <span className="text-4xl font-extrabold text-white drop-shadow-md">{numericScore}</span>
        <span className="text-xs text-white/80 uppercase tracking-widest mt-1 font-bold drop-shadow-sm">Score</span>
      </div>
    </div>
  );
};

export default ScoreChart;
