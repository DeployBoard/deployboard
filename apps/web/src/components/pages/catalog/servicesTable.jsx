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
import findUniqueFields from "../../structure/findUniqueFields";
import { getToken } from "../../utils/auth";

const ServicesTable = () => {
  let services = [];
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URI}/services`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
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
    getServices();
  }, []);

  if (data) {
    services = findUniqueFields(data, "service");
  }
  if (loading) return <LinearProgress />;
  if (error)
    return <CustomSnackbar severity={"error"} message={error.message} />;

  return (
    <Paper elevation={3}>
      <Box display="flex" sx={{ pt: ".5rem", px: "1rem" }}>
        <Typography variant="h6">Services</Typography>
        <Typography variant="h6">&nbsp;</Typography>
        <Typography variant="body2">({services.length})</Typography>
      </Box>
      <List>
        {services.map((item) => (
          <Box key={item}>
            <Divider />
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link}
                to={`/catalog/services/${item}`}
                sx={{ px: "1rem" }}
              >
                {item}
              </ListItemButton>
            </ListItem>
          </Box>
        ))}
      </List>
    </Paper>
  );
};

export default ServicesTable;
