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

import { tzConvert } from "tz-convert";

const GetAccountAndServices = gql`
  query GetAccountAndServices(
    $accountfilter: FilterFindOneAccountInput
    $serviceManyFilter: FilterFindManyServiceInput
  ) {
    accountOne(filter: $accountfilter) {
      environments
    }
    serviceMany(filter: $serviceManyFilter) {
      _id
      team
      service
      environments {
        _id
        name
        status
        version
        timestamp
        custom
      }
    }
  }
`;

const DashboardCards = () => {
  const { loading, error, data } = useQuery(GetAccountAndServices, {
    variables: {
      accountfilter: {
        name: "Seed",
      },
      serviceManyFilter: {
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
            {data.accountOne.environments.map((item) => (
              <TableCell key={item} align="right">
                {item}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.serviceMany.map((item) => (
            <TableRow
              key={`${item._id}`}
              hover
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{item.service}</TableCell>
              {item.environments.map((env) => (
                <TableCell align="right">
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
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DashboardCards;
