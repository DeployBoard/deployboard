import { Paper, Typography } from "@mui/material";

export const AnalyticsNumberBox = ({ title, number }) => {
  return (
    <Paper
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        margin: "10px",
      }}
    >
      <Typography
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="h4"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {number}
      </Typography>
    </Paper>
  );
};

export default AnalyticsNumberBox;
