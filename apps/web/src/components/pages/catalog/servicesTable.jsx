import { useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { LinearProgress } from "@mui/material";

import CustomSnackbar from "../../structure/customSnackbar";
import findUniqueFields from "../../structure/findUniqueFields";
import { getToken } from "../../utils/auth";

const ServicesTable = () => {
  let services = [];
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getServices = () => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URI}/services`, {
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
        setLoading(false);
        setError(error.message);
      });
  };

  useEffect(() => {
    getServices();
  }, []);

  if (data) {
    services = findUniqueFields(data, "service");
  }
  if (loading) return <LinearProgress />;
  if (error)
    return <CustomSnackbar severity={"error"} message={error.message} />;

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Services ({services.length})</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {services.map((item) => (
            <TableRow
              hover
              key={item}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left">{item}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ServicesTable;
