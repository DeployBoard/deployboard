import { useState, useEffect } from "react";
import axios from "axios";
import { LinearProgress } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import CustomSnackbar from "../../../structure/customSnackbar";
import { tzConvert } from "tz-convert";
import { getToken } from "../../../utils/auth";

const UsersTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getUsers = () => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URI}/users`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((res) => {
        // console.log(res.data);
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  if (loading) return <LinearProgress />;
  if (error) return <CustomSnackbar severity={"error"} message={error} />;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell align="right">Role</TableCell>
            <TableCell align="right">Enabled</TableCell>
            <TableCell align="right">Last Logged In</TableCell>
            <TableCell align="right">Created</TableCell>
            <TableCell align="right">Updated</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow
              hover
              key={item._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left">{item.email}</TableCell>
              <TableCell align="right">{item.role}</TableCell>
              <TableCell align="right">{`${item.enabled}`}</TableCell>
              <TableCell align="right">
                {tzConvert(item.lastLoggedIn)}
              </TableCell>
              <TableCell align="right">{tzConvert(item.createdAt)}</TableCell>
              <TableCell align="right">{tzConvert(item.updatedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsersTable;
