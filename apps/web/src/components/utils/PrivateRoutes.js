import { Outlet, Navigate } from "react-router";

const PrivateRoutes = () => {
  let token = sessionStorage.getItem("jwt");
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
