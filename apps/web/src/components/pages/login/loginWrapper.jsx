import { Box, Container, Paper, CssBaseline } from "@mui/material";

import logo from "../../../assets/DeployBoard256.png";

const LoginWrapper = ({ content }) => {
  return (
    <>
      <CssBaseline />

      <Box display="flex" height="100vh" width="100vw" pt="3rem">
        <Container maxWidth="xs">
          <Paper elevation={5} sx={{ p: "2rem" }}>
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
              {content}
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default LoginWrapper;
