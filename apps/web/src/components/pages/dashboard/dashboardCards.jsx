import { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Chip, LinearProgress } from "@mui/material";

import CustomSnackbar from "../../structure/customSnackbar";
import { tzConvert } from "tz-convert";
import { getToken } from "../../utils/auth";

const DashboardCards = () => {
  const [environments, setEnvironments] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingEnvironments, setLoadingEnvironments] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [errorEnvironments, setErrorEnvironments] = useState("");
  const [errorServices, setErrorServices] = useState("");

  const getEnvironments = async () => {
    setLoadingEnvironments(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URI}/environments`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      // console.log(res.data);
      setEnvironments(res.data);
      setLoadingEnvironments(false);
    } catch (error) {
      console.log(error);
      setLoadingEnvironments(false);
      setErrorEnvironments(error.message);
    }
  };

  const getServices = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URI}/services`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      // console.log(res.data);
      setServices(res.data);
      setLoadingServices(false);
    } catch (error) {
      console.log(error);
      setLoadingServices(false);
      setErrorServices(error.message);
    }
  };

  useEffect(() => {
    getEnvironments();
    getServices();
  }, []);

  if (loadingEnvironments || loadingServices) return <LinearProgress />;
  if (errorEnvironments)
    return <CustomSnackbar severity={"error"} message={errorEnvironments} />;
  if (errorServices)
    return <CustomSnackbar severity={"error"} message={errorServices} />;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Service</TableCell>
            {environments
              ? environments.map((item) => (
                  <TableCell key={item} align="right">
                    {item}
                  </TableCell>
                ))
              : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {services
            ? services.map((item) => (
                <TableRow
                  key={`${item._id}`}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{item.service}</TableCell>
                  {environments.map((envName) => {
                    // Find the matching environment data for this service
                    const env = item.environments.find(
                      (e) => e.name === envName
                    );
                    
                    return (
                      <TableCell key={envName} align="right">
                        {env ? (
                          <>
                            {env.version}
                            <br />
                            {(() => {
                              if (env.status === "Deployed") {
                                return (
                                  <Chip
                                    label={env.status}
                                    color="success"
                                    variant="outlined"
                                    size="small"
                                  />
                                );
                              } else if (env.status === "Deploying") {
                                return (
                                  <Chip
                                    label={env.status}
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                  />
                                );
                              } else if (env.status === "Failed") {
                                return (
                                  <Chip
                                    label={env.status}
                                    color="error"
                                    variant="outlined"
                                    size="small"
                                  />
                                );
                              } else {
                                return (
                                  <Chip
                                    label={env.status}
                                    color="secondary"
                                    variant="outlined"
                                    size="small"
                                  />
                                );
                              }
                            })()}
                            <br />
                            {tzConvert(env.timestamp)}
                          </>
                        ) : (
                          <Chip
                            label="No Data"
                            color="default"
                            variant="outlined"
                            size="small"
                          />
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DashboardCards;
