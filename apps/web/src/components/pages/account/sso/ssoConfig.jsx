import { Container } from "@mui/material";

import Header from "../../../structure/header";
import AccountNav from "../accountNav";
import SamlConfig from "./samlConfig";

const SSOConfig = () => {
  return (
    <>
      <Header />
      <AccountNav />
      <Container>
        <SamlConfig />
      </Container>
    </>
  );
};

export default SSOConfig;
