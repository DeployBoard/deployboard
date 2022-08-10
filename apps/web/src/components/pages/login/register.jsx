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
import RocketOutlinedIcon from "@mui/icons-material/RocketOutlined";

import CustomSnackbar from "../../structure/customSnackbar";
import logo from "../../../assets/DeployBoard256.png";

const Register = () => {
  let [account, setAccount] = useState("");
  let [email, setEmail] = useState("");
  let [error, setError] = useState("");
  let [warning, setWarning] = useState("");
  let [success, setSuccess] = useState("");
  let [pending, setPending] = useState(false);

  const handleChangeAccount = (event) => {
    setAccount(event.target.value);
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    // TODO: put some form validation here
    event.preventDefault();
    setPending(true);
    // make the register api call
    try {
      const response = await fetch(
        `${process.env.REACT_APP_AUTH_URI}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ account, email }),
        }
      );
      // check the response status
      const status = response.status;
      // extract the jwt from the response
      const { message } = await response.json();
      if (status == 400) {
        setWarning(message);
      } else {
        setSuccess(message);
      }
      setPending(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
      setPending(false);
    }
  };

  return (
    <Box p="2rem">
      {error && <CustomSnackbar severity="error" message={error} />}
      {warning && <CustomSnackbar severity="warning" message={warning} />}
      {success && <CustomSnackbar severity="success" message={success} />}
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
              id="account"
              name="account"
              label="Account"
              type="text"
              placeholder="Account"
              onChange={handleChangeAccount}
              sx={{ mb: "1rem" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <RocketOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
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
              You will be emailed a link to complete the registration.
            </Typography>
            <Typography variant="caption">
              <Link href="/forgot">Forgot Password?</Link>
            </Typography>
            <Typography variant="caption">
              Already have an account? <Link href="/login">Log In</Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;
