import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Link,
  CssBaseline,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import { jwtDecode } from "jwt-decode";

import LoginWrapper from "./loginWrapper";
import CustomSnackbar from "../../structure/customSnackbar";
import { setToken } from "../../utils/auth";
import useStore from "../../utils/appStore";

const Login = () => {
  const navigate = useNavigate();
  let [showPassword, setShowPassword] = useState(false);
  let [password, setPassword] = useState("");
  let [email, setEmail] = useState("");
  let [success, setSuccess] = useState("");
  let [warning, setWarning] = useState("");
  let [error, setError] = useState("");
  let [pending, setPending] = useState(false);
  const setStoreEmail = useStore((state) => state.setEmail);
  const setStoreAccount = useStore((state) => state.setAccount);
  const setStoreRole = useStore((state) => state.setRole);
  const loggedOut = window.location.search.includes("loggedOut");

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPending(true);
    // make the login api call
    try {
      const response = await fetch(`${process.env.REACT_APP_AUTH_URI}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      // check the response status
      const status = response.status;
      // get the message and token from our response.
      const { message, token } = await response.json();
      if (status == 200) {
        // set the token in our session storage
        setToken(token);
        setSuccess(message);
        // decode the token and get the user info
        const decodedToken = jwtDecode(token);
        // set the email, account and role in our store
        setStoreEmail(decodedToken.email);
        setStoreAccount(decodedToken.account);
        setStoreRole(decodedToken.role);
        // redirect to the dashboard
        navigate("/dashboard");
      } else if (status == 401) {
        setWarning(message);
      } else {
        setWarning(message);
      }
      setPending(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
      setPending(false);
    }
  };

  return (
    <>
      <CssBaseline />
      {loggedOut && (
        <CustomSnackbar
          severity="success"
          message="You have been logged out."
        />
      )}
      {success && <CustomSnackbar severity="success" message={success} />}
      {warning && <CustomSnackbar severity="warning" message={warning} />}
      {error && <CustomSnackbar severity="error" message={error} />}
      <LoginWrapper
        content={
          <>
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
            <Button
              loading={pending}
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleSubmit}
              sx={{ p: ".75rem", mb: "1rem" }}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              color="primary"
              href="/login/sso"
              sx={{ p: ".75rem", mb: "1rem" }}
            >
              Log In with SSO
            </Button>
            <Typography variant="caption">
              <Link href="/forgot">Forgot Password?</Link>
            </Typography>
            <Typography variant="caption">
              Don't have an account? <Link href="/register">Sign Up</Link>
            </Typography>
          </>
        }
      />
    </>
  );
};

export default Login;
