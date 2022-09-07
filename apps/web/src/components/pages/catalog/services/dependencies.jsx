import { List, Paper, Typography } from "@mui/material";

const Dependencies = ({ links }) => {
  return (
    <Paper>
      <Typography variant="h6" sx={{ p: "1rem" }}>
        Dependencies
      </Typography>
      <List>
        {links.map((link) => (
          <Typography variant="body1">
            <a href={link.url}>{link.name}</a>
          </Typography>
        ))}
      </List>
    </Paper>
  );
};

export default Dependencies;
