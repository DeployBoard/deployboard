import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ImageIcon from "@mui/icons-material/Image";

import Header from "../structure/header";

const Dashboard = () => {
  const [services, setServices] = useState([]);

  const getServices = async () => {
    const servicesApi = process.env.REACT_APP_API_URI + "/services";

    console.log(servicesApi);

    try {
      const response = await axios.get(servicesApi, {
        headers: { Authorization: "test" },
      });
      console.log(response);
      setServices(response.data);
    } catch (error) {
      console.log(error);
    }

    return [];
  };

  useEffect(() => {
    getServices();
  }, []);

  return (
    <>
      <Header />
      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
              {services.map((item) => (
                <Fragment key={item._id}>
                  {Object.keys(item.environments).map((env) => (
                    <TableRow
                      key={`${item._id}+${env}`}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {item.service}
                      </TableCell>
                      <TableCell align="right">{item.application}</TableCell>
                      <TableCell align="right">{env}</TableCell>
                      <TableCell align="right">
                        {item.environments[env].version}
                      </TableCell>
                      <TableCell align="right">
                        {item.environments[env].status}
                      </TableCell>
                      <TableCell align="right">
                        {item.environments[env].timestamp}
                      </TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default Dashboard;
