import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
} from "@mui/material";
import { tzConvert } from "tz-convert";

const EnvironmentStatus = ({ environments }) => {
  if (!environments || environments.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No environment data available
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Environment</TableCell>
            <TableCell>Version</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {environments.map((env) => (
            <TableRow
              key={env._id || env.name}
              hover
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{env.name}</TableCell>
              <TableCell>{env.version}</TableCell>
              <TableCell>
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
              <TableCell>{tzConvert(env.timestamp)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EnvironmentStatus;
