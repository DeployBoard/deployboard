import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Link,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

import logo from "../../../assets/DeployBoard256.png";

const SamlLogin = () => {
  let [email, setEmail] = useState("");

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(email);
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
