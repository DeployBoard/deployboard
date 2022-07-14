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
import faker from "faker";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

const labels = [
  "1/1",
  "1/2",
  "1/3",
  "Jan 4",
  "Jan 5",
  "Jan 6",
  "Jan 7",
  "Jan 8",
  "Jan 9",
  "Jan 10",
  "Jan 11",
  "Jan 12",
  "Jan 13",
  "Jan 14",
  "Jan 15",
  "Jan 16",
  "Jan 17",
  "Jan 18",
  "Jan 19",
  "Jan 20",
  "Jan 21",
  "Jan 22",
  "Jan 23",
  "Jan 24",
  "Jan 25",
  "Jan 26",
  "Jan 27",
  "Jan 28",
  "Jan 29",
  "Jan 30",
  "Jan 31",
];

export const options = {
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

const data = {
  labels,
  datasets: [
    {
      type: "line",
      label: "Failed",
      data: labels.map(() => faker.random.number({ min: 0, max: 3 })),
      borderColor: "rgb(255, 25, 25)",
      backgroundColor: "rgb(255, 25, 25)",
      borderWidth: 2,
      fill: true,
    },
    {
      type: "bar",
      label: "Deployed",
      data: labels.map(() => faker.random.number({ min: 0, max: 25 })),
      backgroundColor: "rgb(25, 150, 220)",
    },
  ],
};

export default function BarChart() {
  return <Chart options={options} data={data} />;
}
