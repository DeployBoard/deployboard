import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

import CustomSnackbar from "../../structure/customSnackbar";

import logo from "../../../assets/DeployBoard256.png";

const CompleteRegistration = () => {
  let { uuid } = useParams();
  let [password, setPassword] = useState("");
  let [showPassword, setShowPassword] = useState(false);
  let [error, setError] = useState("");
  let [warning, setWarning] = useState("");
  let [success, setSuccess] = useState("");
  let [pending, setPending] = useState(false);

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // make the register api call
    try {
      setPending(true);
      const response = await fetch(
        `${process.env.REACT_APP_AUTH_URI}/complete-registration`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uuid, password }),
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
            {success ? (
              <>
                <Typography sx={{ mb: "1rem" }} align="center">
                  Registration completed successfully.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  href="/login"
                  sx={{
                    mb: "1rem",
                  }}
                >
                  Return to Login
                </Button>
              </>
            ) : (
              <>
                <Typography sx={{ mb: "1rem" }} align="center">
                  Enter a password for your first user.
                </Typography>
                <TextField
                  id="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  placeholder="Password"
                  onChange={handleChangePassword}
                  sx={{ mb: "1rem" }}
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
              </>
            )}

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

export default CompleteRegistration;
