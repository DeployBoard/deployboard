import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";
import { Chart } from "react-chartjs-2";

import CustomSnackbar from "../../structure/customSnackbar";
import { getToken } from "../../utils/auth";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

export const chartOptions = {
  plugins: {
    title: {
      display: true,
      text: "Deployments Per Day",
    },
    legend: {
      display: false,
    },
  },
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const chartData = (labels, deployedData, failedData) => {
  return {
    labels,
    datasets: [
      {
        type: "line",
        label: "Failed",
        data: failedData,
        borderColor: "rgb(255, 25, 25)",
        backgroundColor: "rgb(255, 25, 25)",
        borderWidth: 2,
        fill: true,
      },
      {
        type: "bar",
        label: "Deployed",
        data: deployedData,
        backgroundColor: "rgb(25, 150, 220)",
      },
    ],
  };
};

const BarChart = ({ daysAgo, filter }) => {
  const [deployedData, setDeployedData] = useState(null);
  const [failedData, setFailedData] = useState(null);
  const [labels, setLabels] = useState(null);
  const [error, setError] = useState(null);

  const formatChartData = (data) => {
    const labels = [];
    const deployments = [];
    const failures = [];
    Object.entries(data).forEach(([key, value]) => {
      labels.push(key);
      deployments.push(value.Deployed);
      failures.push(value.Failed);
    });
    // reverse the arrays so the data is in the correct order
    return {
      labels: labels.reverse(),
      deployments: deployments.reverse(),
      failures: failures.reverse(),
    };
  };

  // query analytics endpoint for total deployments
  const getGraphData = (daysAgo, filter) => {
    axios
      .get(`${process.env.REACT_APP_API_URI}/analytics/deployment-graph`, {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
        params: {
          daysAgo: daysAgo,
          ...filter,
        },
        timeout: 10000,
      })
      .then((response) => {
        // console.log(response);
        const formattedData = formatChartData(response.data);
        setLabels(formattedData.labels);
        setDeployedData(formattedData.deployments);
        setFailedData(formattedData.failures);
      })
      .catch((error) => {
        setError(error);
      });
  };

  useEffect(() => {
    getGraphData(daysAgo, filter);
  }, [daysAgo, filter]);

  return (
    <>
      {error ? (
        <CustomSnackbar severity={"error"} message={error.message} />
      ) : null}
      <Chart
        options={chartOptions}
        data={chartData(labels, deployedData, failedData)}
      />
    </>
  );
};

export default BarChart;
