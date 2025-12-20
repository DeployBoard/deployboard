import { Fragment, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
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
import { tzConvert } from "tz-convert";
import { getToken } from "../../utils/auth";

const LogsTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [logsData, setLogsData] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsError, setLogsError] = useState("");
  const [logsCount, setLogsCount] = useState(0);
  const [logsCountLoading, setLogsCountLoading] = useState(true);
  const [logsCountError, setLogsCountError] = useState("");
  const [servicesData, setServicesData] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState("");
  const [environmentsData, setEnvironmentsData] = useState([]);
  const [environmentsLoading, setEnvironmentsLoading] = useState(true);
  const [environmentsError, setEnvironmentsError] = useState("");
  const [statusesData, setStatusesData] = useState([]);
  const [statusesLoading, setStatusesLoading] = useState(true);
  const [statusesError, setStatusesError] = useState("");

  const getLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URI}/logs`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        params: searchParams,
      });
      // console.log(res.data);
      setLogsData(res.data);
      setLogsLoading(false);
    } catch (error) {
      console.log(error);
      setLogsError(error.message);
      setLogsLoading(false);
    }
  };

  const getLogsCount = async () => {
    setLogsCountLoading(true);
    // we have to convert the searchParams to an object
    const paramsObject = Object.fromEntries([...searchParams]);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URI}/logs`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        params: { count: true, ...paramsObject },
      });
      // console.log(res.data);
      setLogsCount(res.data);
      setLogsCountLoading(false);
    } catch (error) {
      console.log(error);
      setLogsCountError(error.message);
      setLogsCountLoading(false);
    }
  };

  const getServices = async () => {
    setServicesLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URI}/services`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      // console.log(res.data);
      setServicesData(res.data);
      setServicesLoading(false);
    } catch (error) {
      console.log(error);
      setServicesError(error.message);
      setServicesLoading(false);
    }
  };

  const getEnvironments = async () => {
    setEnvironmentsLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URI}/environments`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      // console.log(res.data);
      setEnvironmentsData(res.data);
      setEnvironmentsLoading(false);
    } catch (error) {
      console.log(error);
      setEnvironmentsError(error.message);
      setEnvironmentsLoading(false);
    }
  };

  const getStatuses = async () => {
    setStatusesLoading(true);
    try {
      const statuses = await axios.get(
        `${process.env.REACT_APP_API_URI}/statuses`,
        {
          headers: {
            authorization: `Bearer ${getToken()}`,
          },
          timeout: 10000,
        }
      );
      // console.log("statuses", statuses.data);
      setStatusesData(statuses.data);
      setStatusesLoading(false);
    } catch (err) {
      console.log(err);
      setStatusesError(err.message);
      setServicesLoading(false);
    }
  };

  useEffect(() => {
    getLogs();
    getLogsCount();
    getServices();
    getEnvironments();
    getStatuses();
  }, [searchParams]);

  if (logsLoading || logsCountLoading) return <LinearProgress />;
  if (logsError)
    return <CustomSnackbar severity={"error"} message={logsError} />;
  if (logsCountError)
    return <CustomSnackbar severity={"error"} message={logsCountError} />;
  if (servicesError)
    return <CustomSnackbar severity={"error"} message={servicesError} />;
  if (environmentsError)
    return <CustomSnackbar severity={"error"} message={environmentsError} />;
  if (statusesError)
    return <CustomSnackbar severity={"error"} message={statusesError} />;

  return (
    <>
      <Stack
        justifyContent="flex-end"
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 1, md: 2 }}
      >
        <Box sx={{ width: 200 }}>
          <CustomFilter
            label="Service"
            options={findUniqueFields(servicesData, "service")}
            selected={searchParams.get("service")}
            loading={servicesLoading}
            onSelect={(value) => {
              if (value) {
                searchParams.set("service", value);
                // Reset our skip to 0 when the limit/rowsPerPage changes.
                searchParams.set("skip", 0);
              } else {
                searchParams.delete("service");
              }
              setSearchParams(searchParams);
            }}
          />
        </Box>
        <Box sx={{ width: 200 }}>
          <CustomFilter
            label="Environment"
            options={environmentsData}
            selected={searchParams.get("environment")}
            loading={environmentsLoading}
            onSelect={(value) => {
              if (value) {
                searchParams.set("environment", value);
                // Reset our skip to 0 when the limit/rowsPerPage changes.
                searchParams.set("skip", 0);
              } else {
                searchParams.delete("environment");
              }
              setSearchParams(searchParams);
            }}
          />
        </Box>
        <Box sx={{ width: 200 }}>
          <CustomFilter
            label="Status"
            options={statusesData}
            selected={searchParams.get("status")}
            loading={statusesLoading}
            onSelect={(value) => {
              if (value) {
                searchParams.set("status", value);
                // Reset our skip to 0 when the limit/rowsPerPage changes.
                searchParams.set("skip", 0);
              } else {
                searchParams.delete("status");
              }
              setSearchParams(searchParams);
            }}
          />
        </Box>
      </Stack>
      <CustomTablePagination
        rowsPerPage={Number(searchParams.get("limit")) || 25}
        page={
          searchParams.get("skip") && Number(searchParams.get("limit"))
            ? Number(searchParams.get("skip")) /
              Number(searchParams.get("limit"))
            : 0
        }
        totalItems={logsCount}
        onChangePage={(page) => {
          // console.log(page);
          // if we don't have a limit, set it to the default of 25
          if (!searchParams.get("limit")) {
            searchParams.set("limit", 25);
          }
          setSearchParams(searchParams);
          searchParams.set("skip", page * Number(searchParams.get("limit")));
          setSearchParams(searchParams);
          // setSkip(page * limit);
          // setPage(page);
        }}
        onChangeRowsPerPage={(rowsPerPage) => {
          searchParams.set("limit", rowsPerPage);
          // Reset our skip to 0 when the limit/rowsPerPage changes.
          searchParams.set("skip", 0);
          setSearchParams(searchParams);
        }}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell align="right">Environment</TableCell>
              <TableCell align="right">Version</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logsData.map((item) => (
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
                  <TableCell align="right">
                    {tzConvert(item.createdAt)}
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default LogsTable;
