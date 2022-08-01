import { useEffect } from "react";

import { revokeTokens } from "../../utils/auth";
import useStore from "../../utils/appStore";

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

  return <></>;
};

export default Logout;
