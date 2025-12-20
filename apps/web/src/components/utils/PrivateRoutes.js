import { jwtDecode } from "jwt-decode";
import { Outlet, Navigate } from "react-router";
import { getToken, revokeTokens } from "./auth";

const PrivateRoutes = () => {
  let token = getToken();
  // if we have a token, check if it's expired
  if (token) {
    // decode the token to get the expiration date
    const decoded = jwtDecode(token);
    // if the token is expired, remove it from local storage and navigate to login
    if (decoded.exp < Date.now() / 1000) {
      token = null;
      revokeTokens();
    }
  }
  // if we don't have a token, redirect to login, if we do have a token, render the routes
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
