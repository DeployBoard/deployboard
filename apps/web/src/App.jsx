import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoutes from "./components/utils/PrivateRoutes";
import Login from "./components/pages/login/login";
import LoginSSO from "./components/pages/login/loginSSO";
import LoginSSOCallback from "./components/pages/login/loginSSOCallback";
import Register from "./components/pages/login/register";
import CompleteRegistration from "./components/pages/login/completeRegistration";
import Forgot from "./components/pages/login/forgot";
import Dashboard from "./components/pages/dashboard/dashboard";
import Catalog from "./components/pages/catalog/catalog";
import Service from "./components/pages/catalog/services/service";
import Team from "./components/pages/catalog/teams/team";
import Logs from "./components/pages/logs/logs";
import Analytics from "./components/pages/analytics/analytics";
import Analytics2 from "./components/pages/analytics2/analytics2";
import Environments from "./components/pages/account/environments/environments";
import Users from "./components/pages/account/users/users";
import ApiKeys from "./components/pages/account/apikeys/apikeys";
import SSOConfig from "./components/pages/account/sso/ssoConfig";
import Integrations from "./components/pages/account/integrations/integrations";
import NotFound from "./components/pages/notFound/notFound";
import Logout from "./components/pages/logout/logout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/login/sso" element={<LoginSSO />} />
        <Route path="/login/sso/callback" element={<LoginSSOCallback />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/complete-registration/:uuid"
          element={<CompleteRegistration />}
        />
        <Route path="/forgot" element={<Forgot />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/services/:serviceId" element={<Service />} />
          <Route path="/catalog/teams/:teamId" element={<Team />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/analytics2" element={<Analytics2 />} />
          <Route
            path="/account"
            element={<Navigate to="/account/users" replace />}
          />
          <Route path="/account/environments" element={<Environments />} />
          <Route path="/account/users" element={<Users />} />
          <Route path="/account/apikeys" element={<ApiKeys />} />
          <Route path="/account/sso" element={<SSOConfig />} />
          <Route path="/account/integrations" element={<Integrations />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
        <Route path="*" element={<NotFound />} />

        {/* <Route exact path="/applications/:appName" component={ApplicationEdit} /> */}
        {/* <Route exact path="/applications" component={Applications} /> */}
        {/* <Route exact path="/ci" component={DashboardCI} /> */}
        {/* <Route exact path="/infographic" component={Infographic} /> */}
        {/* <Route exact path="/rss" component={RSS} /> */}
        {/* <Route exact path="/import" component={Import} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
