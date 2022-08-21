import { useState, useEffect } from "react";
import axios from "axios";

import { getToken } from "../../utils/auth";
import AnalyticsNumberBox from "./analyticsNumberBox";
import { CircularProgress } from "@mui/material";

const AnalyticsDeploymentFailureRate = ({ daysAgo, filter }) => {
  const [successData, setSuccessData] = useState(null);
  const [successLoading, setSuccessLoading] = useState(true);
  const [successError, setSuccessError] = useState(null);
  const [failedData, setFailedData] = useState(null);
  const [failedLoading, setFailedLoading] = useState(true);
  const [failedError, setFailedError] = useState(null);

  // query analytics endpoint for total deployments
  const getSuccess = (daysAgo, filter) => {
    axios
      .get(`${process.env.REACT_APP_API_URI}/analytics/total-deployments`, {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
        params: {
          daysAgo: daysAgo,
          status: "Deployed",
          ...filter,
        },
        timeout: 10000,
      })
      .then((response) => {
        // console.log(response);
        setSuccessData(response.data);
        setSuccessLoading(false);
      })
      .catch((error) => {
        setSuccessError(error);
        setSuccessLoading(false);
      });
  };

  const getFailures = (daysAgo, filter) => {
    axios
      .get(`${process.env.REACT_APP_API_URI}/analytics/total-deployments`, {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
        params: {
          daysAgo: daysAgo,
          status: "Failed",
          ...filter,
        },
        timeout: 10000,
      })
      .then((response) => {
        // console.log(response);
        setFailedData(response.data);
        setFailedLoading(false);
      })
      .catch((error) => {
        setFailedError(error);
        setFailedLoading(false);
      });
  };

  useEffect(() => {
    getSuccess(daysAgo, filter);
    getFailures(daysAgo, filter);
  }, [daysAgo, filter]);

  if (successLoading || failedLoading) {
    return (
      <AnalyticsNumberBox
        title="Deployment Failure Rate"
        number={<CircularProgress />}
      />
    );
  }

  if (successError || failedError) {
    return <AnalyticsNumberBox title="Deployment Failure Rate" number="Err" />;
  }

  return (
    <AnalyticsNumberBox
      title="Deployment Failure Rate"
      number={`${Math.round((failedData / successData) * 10000) / 100}%`}
    />
  );
};

export default AnalyticsDeploymentFailureRate;
