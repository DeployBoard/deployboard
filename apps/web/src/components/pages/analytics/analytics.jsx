import { useState } from "react";
import {
  Box,
  Container,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CssBaseline,
  Typography,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";

import MiniDrawer from "../../structure/headerDrawer";
import BarChart from "./barChart";
import AnalyticsTotalDeployments from "./analyticsTotalDeployments";
import AnalyticsAveragePerDay from "./analyticsAveragePerDay";
import AnalyticsFilters from "./analyticsFilters";
import AnalyticsFailures from "./analyticsFailures";
import AnalyticsDeploymentFailureRate from "./analyticsDeploymentFailureRate";
import AnalyticsDeploymentRollbackRate from "./analyticsDeploymentRollbackRate";
import { useEffect } from "react";

const Analytics = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setfilter] = useState({});

  useEffect(() => {
    setfilter({
      environment: searchParams.get("environment"),
      service: searchParams.get("service"),
    });
  }, [searchParams]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <MiniDrawer />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" sx={{ pb: "1rem" }}>
          Analytics
        </Typography>
        <Container>
          <Stack
            justifyContent="flex-end"
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 1, md: 2 }}
          >
            <Box sx={{ width: 100 }}>
              <FormControl fullWidth>
                <InputLabel id="select-days-ago-label">Days Ago</InputLabel>
                <Select
                  labelId="select-days-ago-label"
                  id="select-days-ago"
                  value={searchParams.get("daysAgo") || 30}
                  label="Days Ago"
                  size="small"
                  sx={{ width: "100%" }}
                  onChange={(event) => {
                    if (event.target.value) {
                      searchParams.set("daysAgo", event.target.value);
                    } else {
                      searchParams.delete("daysAgo");
                    }
                    setSearchParams(searchParams);
                  }}
                >
                  <MenuItem value={"7"}>7</MenuItem>
                  <MenuItem value={"14"}>14</MenuItem>
                  <MenuItem value={"30"}>30</MenuItem>
                  <MenuItem value={"60"}>60</MenuItem>
                  <MenuItem value={"90"}>90</MenuItem>
                  <MenuItem value={"180"}>180</MenuItem>
                  <MenuItem value={"365"}>365</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <AnalyticsFilters />
          </Stack>
          <Container sx={{ pt: "1rem", pb: "1rem" }}>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <AnalyticsTotalDeployments
                daysAgo={searchParams.get("daysAgo") || 30}
                filter={{ ...filter, status: "Deployed" }}
              />
              <AnalyticsAveragePerDay
                daysAgo={searchParams.get("daysAgo") || 30}
                filter={filter}
              />
              <AnalyticsFailures
                daysAgo={searchParams.get("daysAgo") || 30}
                filter={filter}
              />
              <AnalyticsDeploymentFailureRate
                daysAgo={searchParams.get("daysAgo") || 30}
                filter={filter}
              />
              <AnalyticsDeploymentRollbackRate
                daysAgo={searchParams.get("daysAgo") || 30}
                filter={filter}
              />
            </Box>
          </Container>
          <Box sx={{ height: "20rem" }}>
            <BarChart
              daysAgo={searchParams.get("daysAgo") || 30}
              filter={filter}
            />
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Analytics;
