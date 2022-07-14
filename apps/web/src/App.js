import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/pages/login/login";
import Dashboard from "./components/pages/dashboard/dashboard";
import Catalog from "./components/pages/catalog/catalog";
import Logs from "./components/pages/logs/logs";
import Analytics from "./components/pages/analytics/analytics";
import NotFound from "./components/pages/notFound/notFound";
// import logo from './assets/DeployBoard256.png';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />

        {/* <Route path="/logs" component={Logs} /> */}
        {/* <Route exact path="/applications/:appName" component={ApplicationEdit} /> */}
        {/* <Route exact path="/applications" component={Applications} /> */}
        {/* <Route exact path="/logs" component={Logs} /> */}
        {/* <Route exact path="/ci" component={DashboardCI} /> */}
        {/* <Route exact path="/infographic" component={Infographic} /> */}
        {/* <Route exact path="/rss" component={RSS} /> */}
        {/* <Route exact path="/graphs" component={Graphs} /> */}
        {/* <Route exact path="/analytics" component={Analytics} /> */}
        {/* <Route exact path="/analytics2" component={Analytics2} /> */}
        {/* <Route exact path="/import" component={Import} /> */}
        {/* <Route exact path="/settings/users" component={Users} /> */}
        {/* <Route exact path="/settings/apikeys" component={ApiKeys} /> */}
        {/* <Route exact path="/settings/integrations" component={Integrations} /> */}
        {/* <Route exact path="/settings/billing" component={Billing} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
