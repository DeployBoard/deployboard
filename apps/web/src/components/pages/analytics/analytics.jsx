import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  LinearProgress,
  Paper,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

import Header from "../../structure/header";
import AnalyticsGraphs from "./analyticsGraphs";
import CustomSnackbar from "../../structure/customSnackbar";
import CustomFilter from "../../structure/customFilter";
import CustomTablePagination from "../../structure/customTablePagination";
import findUniqueFields from "../../structure/findUniqueFields";
import BarChart from "./barChart";
import AnalyticsNumberBox from "./analyticsNumberBox";

const GetLogs = gql`
  query GetLogs(
    $filter: FilterFindManyLogInput
    $serviceFilter: FilterFindManyServiceInput
    $sort: SortFindManyLogInput
    $limit: Int
    $skip: Int
    $logCountFilter: FilterCountLogInput
  ) {
    logMany(filter: $filter, sort: $sort, limit: $limit, skip: $skip) {
      _id
      service
      environment
      status
      version
      createdAt
    }
    serviceMany(filter: $serviceFilter) {
      _id
      service
      environments {
        name
      }
    }
    logCount(filter: $logCountFilter)
  }
`;

const setFilter = ({ account, service, environment }) => {
  // Set the filter for the graphql query.
  let filter = {};
  if (account) {
    filter.account = account;
  } else {
    console.error("account is required");
  }
  if (service) {
    filter.service = service;
  }
  if (environment) {
    filter.environment = environment;
  }

  return filter;
};

const priorDate = (daysAgo) => {
  // Get the date in the past.
  return new Date(
    new Date().setDate(new Date().getDate() - daysAgo)
  ).toISOString();
};

const Analytics = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [limit, setLimit] = useState(10000);
  const [skip, setSkip] = useState(0);

  const filter = setFilter({
    account: "Seed",
    service: searchParams.get("service"),
    environment: searchParams.get("environment"),
  });

  console.log("filter", filter);

  // Query the GraphQL API.
  // const { loading, error, data } = useQuery(GetLogs, {
  //   variables: {
  //     filter: {
  //       account: "Seed",
  //       service: searchParams.get("service"),
  //       environment: searchParams.get("environment"),
  //       _operators: {
  //         createdAt: {
  //           gte: priorDate(30),
  //         },
  //       },
  //     },
  //     serviceFilter: {
  //       account: "Seed",
  //     },
  //     sort: "CREATEDAT_DESC",
  //     limit: limit,
  //     skip: skip,
  //     logCountFilter: filter,
  //   },
  // });

  const data = {
    logMany: [
      {
        _id: "01234",
        createdAt: "2020-01-06T00:00:00.000Z",
        status: "Deployed",
      },
      {
        _id: "12345",
        createdAt: "2020-01-01T00:00:00.000Z",
        status: "Deployed",
      },
      {
        _id: "23456",
        createdAt: "2020-01-02T00:00:00.000Z",
        status: "Failed",
      },
    ],
  };

  if (data) {
    console.log("data", data);
  }
  // if (loading) return <LinearProgress />;
  // if (error)
  //   return <CustomSnackbar severity={"error"} message={error.message} />;

  return (
    <>
      <Header />
      <Container>
        <Container>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <AnalyticsNumberBox title="Total Deployments" number={25} />
            <AnalyticsNumberBox title="Total Failures" number={5} />
            <AnalyticsNumberBox
              title="Average Deployments Per Day"
              number={7}
            />
            <AnalyticsNumberBox title="Total Failures" number={5} />
            <AnalyticsNumberBox
              title="Deployment Failure Rate"
              number={"20%"}
            />
            <AnalyticsNumberBox title="Rollback Rate" number={"0%"} />
          </Box>
        </Container>
        <Box>
          <BarChart data={data} />
        </Box>
      </Container>
    </>
  );
};

export default Analytics;
