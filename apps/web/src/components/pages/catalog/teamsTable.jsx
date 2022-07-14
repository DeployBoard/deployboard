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

const GetTeams = gql`
  query GetTeams($filter: FilterFindManyTeamInput) {
    teamMany(filter: $filter) {
      _id
      name
    }
  }
`;

const TeamsTable = () => {
  const { loading, error, data } = useQuery(GetTeams, {
    variables: {
      filter: {
        account: "Seed",
      },
    },
  });

  if (data) {
    console.log(data);
  }
  if (loading) return <LinearProgress />;
  if (error)
    return <CustomSnackbar severity={"error"} message={error.message} />;

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Teams ({data.teamMany.length})</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.teamMany.map((item) => (
            <TableRow
              hover
              key={item._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left">{item.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TeamsTable;
