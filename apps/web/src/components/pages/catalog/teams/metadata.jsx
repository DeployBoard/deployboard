import { List, ListItem, Paper, Typography, Divider } from "@mui/material";

// TODO: Move this stuff up into the page header
const Metadata = ({ data }) => {
  const meta = data.meta || {};

  return (
    <Paper>
      <Typography variant="h6" sx={{ p: "1rem" }}>
        Metadata
      </Typography>
      <Divider />
      <List>
        {/* Loop over each item in the meta object and display it */}
        {Object.keys(meta).map((key) => (
          <ListItem key={key}>
            <Typography variant="body2">
              {key}: {meta[key]}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Metadata;
