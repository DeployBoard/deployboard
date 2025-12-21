import { useState, useEffect } from "react";
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
import InsightsTotalDeployments from "./insightsTotalDeployments";
import InsightsAveragePerDay from "./insightsAveragePerDay";
import InsightsFilters from "./insightsFilters";
import InsightsFailures from "./insightsFailures";
import InsightsDeploymentFailureRate from "./insightsDeploymentFailureRate";
import InsightsDeploymentRollbackRate from "./insightsDeploymentRollbackRate";

const Insights = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState({});

  useEffect(() => {
    setFilter({
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
          Insights
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
            <InsightsFilters filter={filter} setFilter={setFilter} />
          </Stack>
          <Container sx={{ pt: "1rem", pb: "1rem" }}>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <InsightsTotalDeployments
                daysAgo={searchParams.get("daysAgo") || 30}
                filter={{ ...filter, status: "Deployed" }}
              />
              <InsightsAveragePerDay
                daysAgo={searchParams.get("daysAgo") || 30}
                filter={filter}
              />
              <InsightsFailures
                daysAgo={searchParams.get("daysAgo") || 30}
                filter={filter}
              />
              <InsightsDeploymentFailureRate
                daysAgo={searchParams.get("daysAgo") || 30}
                filter={filter}
              />
              <InsightsDeploymentRollbackRate
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

export default Insights;