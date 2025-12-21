import { useState, useEffect } from "react";
import axios from "axios";

import { getToken } from "../../utils/auth";
import InsightsNumberBox from "./insightsNumberBox";
import { CircularProgress } from "@mui/material";

const InsightsDeploymentRollbackRate = ({ daysAgo, filter }) => {
  const [successData, setSuccessData] = useState(null);
  const [successLoading, setSuccessLoading] = useState(true);
  const [successError, setSuccessError] = useState(null);
  const [rollbackData, setRollbackData] = useState(null);
  const [rollbackLoading, setRollbackLoading] = useState(true);
  const [rollbackError, setRollbackError] = useState(null);

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
      // console.log(response.data);
      setSuccessData(response.data);
      setSuccessLoading(false);
    } catch (error) {
      setSuccessError(error);
      setSuccessLoading(false);
    }
  };

  const getRollbacks = async (daysAgo, filter) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URI}/analytics/total-deployments`,
        {
          headers: {
            authorization: `Bearer ${getToken()}`,
          },
          params: {
            daysAgo: daysAgo,
            rollback: true,
            ...filter,
          },
          timeout: 10000,
        }
      );
      // console.log(response.data);
      setRollbackData(response.data);
      setRollbackLoading(false);
    } catch (error) {
      setRollbackError(error);
      setRollbackLoading(false);
    }
  };

  useEffect(() => {
    getSuccess(daysAgo, filter);
    getRollbacks(daysAgo, filter);
  }, [daysAgo, filter]);

  if (successLoading || rollbackLoading) {
    return (
      <InsightsNumberBox title="Rollback Rate" number={<CircularProgress />} />
    );
  }

  if (successError || rollbackError) {
    return <InsightsNumberBox title="Rollback Rate" number="Err" />;
  }

  return (
    <InsightsNumberBox
      title="Rollback Rate"
      number={`${Math.round((rollbackData / successData) * 10000) / 100}%`}
    />
  );
};

export default InsightsDeploymentRollbackRate;
