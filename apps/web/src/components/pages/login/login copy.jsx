import {
  Box,
  Paper,
  InputLabel,
  Input,
  TextField,
  Avatar,
  Button,
  FormControl,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

const Dashboard = () => {
  let state = {
    email: "",
    password: "",
  };

  const handleChange = (event) => {
    state[event.target.name] = event.target.value;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(state);
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="90vh"
      >
        <Paper elevation={3} sx={{ p: "1rem" }}>
          <Avatar>
            <LockIcon />
          </Avatar>
          <Box display="flex" flexDirection="column">
            <TextField
              id="email"
              name="email"
              label="Email"
              type="email"
              onChange={handleChange}
              sx={{ pb: "1rem" }}
            />
            <TextField
              id="password"
              name="password"
              label="Password"
              type="password"
              onChange={handleChange}
              sx={{ pb: "1rem" }}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleSubmit}
              sx={{ pt: "1rem" }}
            >
              Submit
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default Dashboard;
