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
  const setStoreTheme = useStore((state) => state.setTheme);
  const storeTheme = useStore((state) => state.theme);
  const loggedOut = window.location.search.includes("loggedOut");
  const sessionExpired = window.location.search.includes("sessionExpired");

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPending(true);
    // make the login api call
    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_URI}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      // check the response status
      const status = response.status;
      // get the message, token, and theme from our response.
      const { message, token, theme } = await response.json();
      if (status == 200) {
        // set the token in our session storage
        setToken(token);
        setSuccess(message);
        // decode the token and get the user info
        const decodedToken = jwtDecode(token);
        // set the email, account, role, and theme in our store
        setStoreEmail(decodedToken.email);
        setStoreAccount(decodedToken.account);
        setStoreRole(decodedToken.role);
        
        // if the theme changed, set it and do a full reload
        const newTheme = theme || "system";
        const themeChanged = newTheme !== storeTheme;
        
        if (themeChanged) {
          setStoreTheme(newTheme);
          // Full page reload to apply new theme
          window.location.href = "/dashboard";
        } else {
          // Fast navigation - no reload needed
          navigate("/dashboard");
        }
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
      {sessionExpired && (
        <CustomSnackbar
          severity="warning"
          message="Your session has expired. Please log in again."
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
              onKeyDown={handleKeyDown}
              sx={{ mb: "1rem" }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              id="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Password"
              onChange={handleChangePassword}
              onKeyDown={handleKeyDown}
              sx={{ mb: "1rem" }}
              slotProps={{
                input: {
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
                        edge="end"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <VisibilityOffRoundedIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
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
