import { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Tab,
  Paper,
  InputLabel,
  Input,
  TextField,
  Avatar,
  Button,
  FormControl,
  InputAdornment,
  IconButton,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

const Dashboard = () => {
  let [showPassword, setShowPassword] = useState(false);
  let [password, setPassword] = useState("");
  let [email, setEmail] = useState("");

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(email, password);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box p={9}>
      <Container maxWidth="md">
        <Box
          boxShadow="0px 0px 10px 3px #ddd"
          p={"2rem"}
          width="100%"
          height="100%"
        >
          <Grid container spacing={1}>
            <Grid item xs={false} md={7}>
              <Typography variant="h4" color="textSecondary">
                <b>DeployBoard</b>
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box display="flex" flexDirection="column">
                <TextField
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Email"
                  onChange={handleChangeEmail}
                  sx={{ pb: "1rem" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  id="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  placeholder="Password"
                  onChange={handleChangePassword}
                  sx={{ pb: "1rem" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOpenIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={handleClickShowPassword}
                        >
                          {showPassword ? (
                            <VisibilityOffRoundedIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
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
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
