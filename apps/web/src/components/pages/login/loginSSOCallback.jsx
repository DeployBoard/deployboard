import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import jwt_decode from "jwt-decode";

import useStore from "../../utils/appStore";
import { setToken } from "../../utils/auth";

const LoginSSOCallback = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const setStoreEmail = useStore((state) => state.setEmail);
  const setStoreAccount = useStore((state) => state.setAccount);
  const setStoreRole = useStore((state) => state.setRole);

  const getTokenFromUrl = () => {
    const token = searchParams.get("token");
    setToken(token);
    // decode the token and get the user info
    const decodedToken = jwt_decode(token);
    // set the email, account and role in our store
    setStoreEmail(decodedToken.email);
    setStoreAccount(decodedToken.account);
    setStoreRole(decodedToken.role);
    // redirect to the dashboard
    navigate("/dashboard");
  };

  useEffect(() => {
    getTokenFromUrl();
  }, [searchParams]);

  return <></>;
};

export default LoginSSOCallback;
