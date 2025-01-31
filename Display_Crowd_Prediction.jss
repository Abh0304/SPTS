import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const CrowdPredictionChart = ({ routeId }) => {
  const [data, setData] = useState({ labels: [], values: [] });

  useEffect(() => {
    // Fetch predictions from Django API
    fetch(`/api/predict-crowd/?route_id=${routeId}`)
      .then(res => res.json())
      .then(result => {
        setData({
          labels: result.labels,  // Timestamps
          values: result.predictions  // Predicted occupancy rates
        });
      });
  }, [routeId]);

  return (
    <Line
      data={{
        labels: data.labels,
        datasets: [{
          label: 'Predicted Crowd Density',
          data: data.values,
          borderColor: 'rgb(75, 192, 192)'
        }]
      }}
    />
  );
};
