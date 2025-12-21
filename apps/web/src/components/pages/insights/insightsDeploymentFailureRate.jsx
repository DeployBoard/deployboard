import { useState, useEffect } from "react";
import axios from "axios";

import { getToken } from "../../utils/auth";
import InsightsNumberBox from "./insightsNumberBox";
import { CircularProgress } from "@mui/material";

const InsightsDeploymentFailureRate = ({ daysAgo, filter }) => {
  const [successData, setSuccessData] = useState(null);
  const [successLoading, setSuccessLoading] = useState(true);
  const [successError, setSuccessError] = useState(null);
  const [failedData, setFailedData] = useState(null);
  const [failedLoading, setFailedLoading] = useState(true);
  const [failedError, setFailedError] = useState(null);

  // query analytics endpoint for total deployments
  const getSuccess = async (daysAgo, filter) => {
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
      setSuccessData(response.data);
      setSuccessLoading(false);
    } catch (error) {
      setSuccessError(error);
      setSuccessLoading(false);
    }
  };

  const getFailures = async (daysAgo, filter) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URI}/analytics/total-deployments`,
        {
          headers: {
            authorization: `Bearer ${getToken()}`,
          },
          params: {
            daysAgo: daysAgo,
            status: "Failed",
            ...filter,
          },
          timeout: 10000,
        }
      );
      // console.log(response);
      setFailedData(response.data);
      setFailedLoading(false);
    } catch (error) {
      setFailedError(error);
      setFailedLoading(false);
    }
  };

  useEffect(() => {
    getSuccess(daysAgo, filter);
    getFailures(daysAgo, filter);
  }, [daysAgo, filter]);

  if (successLoading || failedLoading) {
    return (
      <InsightsNumberBox
        title="Deployment Failure Rate"
        number={<CircularProgress />}
      />
    );
  }

  if (successError || failedError) {
    return <InsightsNumberBox title="Deployment Failure Rate" number="Err" />;
  }

  return (
    <InsightsNumberBox
      title="Deployment Failure Rate"
      number={`${Math.round((failedData / successData) * 10000) / 100}%`}
    />
  );
};

export default InsightsDeploymentFailureRate;
