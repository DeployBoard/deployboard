import { useState } from "react";
import {
  Typography,
  TextField,
  InputAdornment,
  Link,
  CssBaseline,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

import LoginWrapper from "./loginWrapper";

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
          </>
        }
      />
    </>
  );
};

export default Forgot;
