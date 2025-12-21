import { Paper, Typography } from "@mui/material";

export const InsightsNumberBox = ({ title, number }) => {
  return (
    <Paper
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: ".75rem",
        paddingBottom: ".75rem",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        margin: "1rem",
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

export default InsightsNumberBox;
