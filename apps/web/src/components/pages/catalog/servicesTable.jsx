import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
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

const GetServices = gql`
  query GetServices($filter: FilterFindManyServiceInput) {
    serviceMany(filter: $filter) {
      _id
      service
    }
  }
`;

const ServicesTable = () => {
  let services = [];

  const { loading, error, data } = useQuery(GetServices, {
    variables: {
      filter: {
        account: "Seed",
      },
    },
  });

  if (data) {
    console.log(data);
    services = findUniqueFields(data.serviceMany, "service");
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
