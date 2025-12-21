import { useState, useEffect } from "react";
import axios from "axios";

import { getToken } from "../../utils/auth";
import InsightsNumberBox from "./insightsNumberBox";
import { CircularProgress } from "@mui/material";

const InsightsAveragePerDay = ({ daysAgo, filter }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // query analytics endpoint for total deployments
  const getTotalDeployments = async (daysAgo, filter) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URI}/analytics/total-deployments`,
        {
          headers: {
            authorization: `Bearer ${getToken()}`,
          },
          params: {
            daysAgo: daysAgo,
            status: "Deployed",
            ...filter,
          },
          timeout: 10000,
        }
      );
      // console.log(response);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getTotalDeployments(daysAgo, filter);
  }, [daysAgo, filter]);

  if (loading) {
    return (
      <InsightsNumberBox
        title="Avg Deployments/Day"
        number={<CircularProgress />}
      />
    );
  }

  if (error) {
    return <InsightsNumberBox title="Avg Deployments/Day" number="Err" />;
  }

  return (
    <InsightsNumberBox
      title="Avg Deployments/Day"
      number={Math.round(data / daysAgo)}
    />
  );
};

export default InsightsAveragePerDay;
