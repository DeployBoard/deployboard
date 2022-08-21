import { useState, useEffect } from "react";
import axios from "axios";

import { getToken } from "../../utils/auth";
import AnalyticsNumberBox from "./analyticsNumberBox";
import { CircularProgress } from "@mui/material";

const AnalyticsTotalDeployments = ({ daysAgo, filter }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // query analytics endpoint for total deployments
  const getTotalDeployments = (daysAgo, filter) => {
    axios
      .get(`${process.env.REACT_APP_API_URI}/analytics/total-deployments`, {
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
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getTotalDeployments(daysAgo, filter);
  }, [daysAgo, filter]);

  if (loading) {
    return (
      <AnalyticsNumberBox
        title="Total Deployments"
        number={<CircularProgress />}
      />
    );
  }

  if (error) {
    return <AnalyticsNumberBox title="Total Deployments" number="Err" />;
  }

  return <AnalyticsNumberBox title="Total Deployments" number={data} />;
};

export default AnalyticsTotalDeployments;
