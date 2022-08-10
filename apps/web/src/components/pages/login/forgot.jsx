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
import LoadingButton from "@mui/lab/LoadingButton";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

import logo from "../../../assets/DeployBoard256.png";

const Forgot = () => {
  let [email, setEmail] = useState("");
  let [pending, setPending] = useState(false);

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setPending(true);
    console.log(email);
    setPending(false);
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
                src={logo}
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
            <LoadingButton
              loading={pending}
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleSubmit}
              sx={{ p: ".75rem", mb: "1rem" }}
            >
              Submit
            </LoadingButton>
            <Typography variant="caption" align="right" pb="1rem">
              You will be emailed a link to complete the password reset.
            </Typography>
            <Typography variant="caption">
              Remember now? <Link href="/login">Log In</Link>
            </Typography>
            <Typography variant="caption">
              Don't have an account? <Link href="/register">Sign Up</Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Forgot;
