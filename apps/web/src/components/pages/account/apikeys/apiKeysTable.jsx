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

import ApiKeyRow from "./apiKeyRow";
import CustomSnackbar from "../../../structure/customSnackbar";
import { getToken } from "../../../utils/auth";

const ApiKeysTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getUsers = () => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URI}/apikeys`, {
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
            <TableCell>Key ID</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Role</TableCell>
            <TableCell align="right">Enabled</TableCell>
            <TableCell align="right">Created</TableCell>
            <TableCell align="right">Updated</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <ApiKeyRow key={item._id} keyData={item} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ApiKeysTable;
