import { useEffect } from "react";

import { revokeTokens } from "../../utils/auth";
import useStore from "../../utils/appStore";
import { CssBaseline } from "@mui/material";

const Logout = () => {
  const removeAllState = useStore((state) => state.removeAllState);

  const handleLogout = () => {
    revokeTokens();
    removeAllState();
    window.location.href = "/login?loggedOut=true";
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <>
      <CssBaseline />
    </>
  );
};

export default Logout;
