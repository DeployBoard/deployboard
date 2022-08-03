import { Fragment } from "react";
import { useQuery, gql } from "@apollo/client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Chip, LinearProgress } from "@mui/material";

const GetServices = gql`
  query GetServices($filter: FilterFindManyServiceInput) {
    serviceMany(filter: $filter) {
      _id
      team
      environments {
        _id
        name
        status
        version
        timestamp
        custom
      }
      service
    }
  }
`;

const DashboardTable = () => {
  const { loading, error, data } = useQuery(GetServices, {
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
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Service</TableCell>
            <TableCell align="right">Team</TableCell>
            <TableCell align="right">Environment</TableCell>
            <TableCell align="right">Version</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.serviceMany.map((item) => (
            <Fragment key={item._id}>
              {item.environments.map((env) => (
                <TableRow
                  key={`${item._id}-${env._id}`}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">{item.service}</TableCell>
                  <TableCell align="right">{item.team}</TableCell>
                  <TableCell align="right">{env.name}</TableCell>
                  <TableCell align="right">{env.version}</TableCell>
                  <TableCell align="right">
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
                  </TableCell>
                  <TableCell align="right">{env.timestamp}</TableCell>
                </TableRow>
              ))}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DashboardTable;
