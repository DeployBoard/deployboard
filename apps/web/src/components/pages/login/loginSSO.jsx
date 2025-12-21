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

const LoginSSO = () => {
  let [email, setEmail] = useState("");
  let [pending, setPending] = useState(false);
  let [warning, setWarning] = useState("");
  let [error, setError] = useState("");

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPending(true);
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
      } else {
        setWarning(message);
      }

      console.log(message);
      if (status == 200) {
        // TODO: I don't think we need this code because the api redirects to the sso provider.
        // We should never get a 200 status code here.
        console.log("token", token);
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
