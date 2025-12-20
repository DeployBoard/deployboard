import { useEffect, useState } from "react";
import axios from "axios";
import {
  Divider,
  Box,
  Typography,
  Link,
  List,
  ListItem,
  ListItemButton,
  Paper,
  LinearProgress,
} from "@mui/material";

import CustomSnackbar from "../../structure/customSnackbar";
import { getToken } from "../../utils/auth";

const TeamsTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getTeams = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URI}/teams`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      // console.log(res.data);
      setData(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    getTeams();
  }, []);

  if (loading) return <LinearProgress />;
  if (error)
    return <CustomSnackbar severity={"error"} message={error.message} />;

  return (
    <Paper elevation={3}>
      <Box display="flex" sx={{ pt: ".5rem", px: "1rem" }}>
        <Typography variant="h6">Teams</Typography>
        <Typography variant="h6">&nbsp;</Typography>
        <Typography variant="body2">({data.length})</Typography>
      </Box>
      <List>
        {data.map((item) => (
          <Box key={item._id}>
            <Divider />
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link}
                to={`/catalog/teams/${item.name}`}
                sx={{ px: "1rem" }}
              >
                {item.name}
              </ListItemButton>
            </ListItem>
          </Box>
        ))}
      </List>
    </Paper>
  );
};

export default TeamsTable;
