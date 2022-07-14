import { Fragment, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { Box, Stack, Chip, LinearProgress } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import CustomSnackbar from "../../structure/customSnackbar";
import CustomFilter from "../../structure/customFilter";
import CustomTablePagination from "../../structure/customTablePagination";
import findUniqueFields from "../../structure/findUniqueFields";

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

const AnalyticsGraphs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [limit, setLimit] = useState(25);
  const [skip, setSkip] = useState(0);

  const filter = setFilter({
    account: "Seed",
    service: searchParams.get("service"),
    environment: searchParams.get("environment"),
    limit: limit,
    skip: skip,
  });

  console.log("filter", filter);

  // Query the GraphQL API.
  const { loading, error, data } = useQuery(GetLogs, {
    variables: {
      filter: filter,
      serviceFilter: {
        account: "Seed",
      },
      sort: "CREATEDAT_DESC",
      limit: limit,
      skip: skip,
      logCountFilter: filter,
    },
  });

  if (data) {
    console.log("data", data);
  }
  if (loading) return <LinearProgress />;
  if (error)
    return <CustomSnackbar severity={"error"} message={error.message} />;

  return (
    <>
      <Stack
        justifyContent="flex-end"
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 1, md: 2 }}
      >
        <Box sx={{ width: 250 }}>
          <CustomFilter
            label="Service"
            options={findUniqueFields(data.serviceMany, "service")}
            selected={searchParams.get("service")}
            onSelect={(value) => {
              if (value) {
                searchParams.set("service", value);
              } else {
                searchParams.delete("service");
              }
              setSearchParams(searchParams);
            }}
          />
        </Box>
        <Box sx={{ width: 250 }}>
          <CustomFilter
            label="Environment"
            options={findUniqueFields(data.logMany, "environment")}
            selected={searchParams.get("environment")}
            onSelect={(value) => {
              if (value) {
                searchParams.set("environment", value);
              } else {
                searchParams.delete("environment");
              }
              setSearchParams(searchParams);
            }}
          />
        </Box>
      </Stack>
      <CustomTablePagination
        rowsPerPage={limit}
        page={skip}
        totalItems={data.logCount}
        onChangePage={(page) => {
          setSkip(page);
        }}
        onChangeRowsPerPage={(rowsPerPage) => {
          setLimit(rowsPerPage);
          // Reset our skip to 0 when the limit/rowsPerPage changes.
          setSkip(0);
        }}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell align="right">Application</TableCell>
              <TableCell align="right">Environment</TableCell>
              <TableCell align="right">Version</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.logMany.map((item) => (
              <Fragment key={item._id}>
                <TableRow
                  hover
                  key={item._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">{item.service}</TableCell>
                  <TableCell align="right">{item.environment}</TableCell>
                  <TableCell align="right">{item.version}</TableCell>
                  <TableCell align="right">
                    {(() => {
                      if (item.status === "Deployed") {
                        return (
                          <Chip
                            label={item.status}
                            color="success"
                            variant="outlined"
                            size="small"
                          />
                        );
                      } else if (item.status === "Deploying") {
                        return (
                          <Chip
                            label={item.status}
                            color="primary"
                            variant="outlined"
                            size="small"
                          />
                        );
                      } else if (item.status === "Failed") {
                        return (
                          <Chip
                            label={item.status}
                            color="error"
                            variant="outlined"
                            size="small"
                          />
                        );
                      } else {
                        return (
                          <Chip
                            label={item.status}
                            color="secondary"
                            variant="outlined"
                            size="small"
                          />
                        );
                      }
                    })()}
                  </TableCell>
                  <TableCell align="right">{item.createdAt}</TableCell>
                </TableRow>
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default AnalyticsGraphs;
