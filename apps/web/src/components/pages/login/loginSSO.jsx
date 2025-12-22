import { useState } from "react";
import {
  CssBaseline,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Link,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

import LoginWrapper from "./loginWrapper";
import CustomSnackbar from "../../structure/customSnackbar";

const LoginSSO = () => {
  let [email, setEmail] = useState("");
  let [pending, setPending] = useState(false);
  let [warning, setWarning] = useState("");
  let [error, setError] = useState("");

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPending(true);
    setWarning("");
    setError("");
    // make the login api call
    try {
      const response = await fetch(
        `${import.meta.env.VITE_AUTH_URI}/login/sso`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      // check the response status
      const status = response.status;
      // get the message and token from our response.
      const { message } = await response.json();

      if (status == 200) {
        // redirect to the saml login page
        window.location.replace(message);
      } else if (status >= 400 && status < 500) {
        // Client errors (401, 400, etc.) - user/request issue
        setWarning(message);
      } else if (status >= 500) {
        // Server errors - something went wrong on the backend
        setError(message);
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
          </>
        }
      />
    </>
  );
};

export default LoginSSO;
