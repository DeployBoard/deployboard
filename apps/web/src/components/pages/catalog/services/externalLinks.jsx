import {
  Box,
  Divider,
  Link,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Typography,
} from "@mui/material";

const ExternalLinks = ({ data }) => {
  const links = data.externalLinks || {};

  return (
    <Paper>
      <Typography variant="h6" sx={{ p: "1rem" }}>
        External Links
      </Typography>

      <List>
        {Object.keys(links).map((key) => (
          <Box key={key}>
            <Divider />
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link}
                to={links[key]}
                sx={{ px: "1rem" }}
              >
                {key}
              </ListItemButton>
            </ListItem>
          </Box>
        ))}
      </List>
    </Paper>
  );
};

export default ExternalLinks;
