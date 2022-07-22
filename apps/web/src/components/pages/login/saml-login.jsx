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
  Link,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

const SamlLogin = () => {
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
    <Box p="2rem">
      <Container maxWidth="xs">
        <Box
          boxShadow="0px 0px 10px 3px #ddd"
          p="2rem"
          width="100%"
          height="100%"
        >
          <Box display="flex" flexDirection="column">
            <Container align="center">
              <Box
                align="center"
                component="img"
                mb="2rem"
                sx={{
                  height: 130,
                  width: 200,
                }}
                alt="deployboard logo"
                src="https://app.deployboard.io/static/media/DeployBoard256.a0aaf1a0.png"
              />
            </Container>
            <TextField
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="Email"
              onChange={handleChangeEmail}
              sx={{ mb: "1rem" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleSubmit}
              sx={{ p: ".75rem", mb: "1rem" }}
            >
              Log In with SSO
            </Button>
            <Typography variant="caption">
              <Link href="/login">Back to Log In</Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SamlLogin;
