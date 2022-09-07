import {
  Box,
  LinearProgress,
  List,
  ListItem,
  Paper,
  Typography,
  Divider,
} from "@mui/material";

const Maturity = ({ links }) => {
  const levels = [
    { name: "Gold", progress: 45 },
    { name: "Silver", progress: 60 },
    { name: "Bronze", progress: 100 },
  ];
  return (
    <Paper>
      <Typography variant="h6" sx={{ p: "1rem" }}>
        Maturity
      </Typography>
      <Divider />
      <List>
        {levels.map((level) => (
          <ListItem key={level.name}>
            <Box sx={{ width: "100%" }}>
              {level.name}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ width: "100%", mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={level.progress}
                  />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2">{level.progress}%</Typography>
                </Box>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Maturity;
