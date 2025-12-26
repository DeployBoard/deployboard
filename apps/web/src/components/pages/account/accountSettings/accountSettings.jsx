import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  Snackbar,
  Grid,
  Divider,
  FormHelperText,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import MiniDrawer from "../../../structure/headerDrawer";
import { getToken } from "../../../utils/auth";

const AccountSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Account settings fields
  const [sessionDuration, setSessionDuration] = useState(null);
  const [passwordPolicy, setPasswordPolicy] = useState(null);

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URI}/accounts`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      console.log("Fetched account data:", res.data);
      setSessionDuration(res.data.sessionDuration);
      setPasswordPolicy(res.data.passwordPolicy);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load account settings");
      setLoading(false);
    }
  };

  const handleSaveSessionDuration = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    // Validation
    const duration = parseInt(sessionDuration);
    if (isNaN(duration) || duration < 1 || duration > 720) {
      setError("Session duration must be between 1 and 720 hours");
      setSaving(false);
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URI}/accounts`,
        {
          sessionDuration: duration,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setSuccess(
        "Session duration updated successfully. Changes will apply to new logins."
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePasswordPolicy = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    // Validate password policy
    if (passwordPolicy.length < 8 || passwordPolicy.length > 128) {
      setError("Password length must be between 8 and 128 characters");
      setSaving(false);
      return;
    }

    if (passwordPolicy.lowercase < 0 || passwordPolicy.uppercase < 0 || 
        passwordPolicy.number < 0 || passwordPolicy.special < 0) {
      setError("Character requirements cannot be negative");
      setSaving(false);
      return;
    }

    // Validate that total requirements don't exceed length
    const totalRequired = 
      passwordPolicy.lowercase + 
      passwordPolicy.uppercase + 
      passwordPolicy.number + 
      passwordPolicy.special;
    
    if (totalRequired > passwordPolicy.length) {
      setError(
        `Total character requirements (${totalRequired}) cannot exceed password length (${passwordPolicy.length})`
      );
      setSaving(false);
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URI}/accounts`,
        {
          passwordPolicy,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setSuccess(
        "Password policy updated successfully. Changes will apply to new passwords."
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccess("");
  };

  const convertToDays = (hours) => {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (days === 0) {
      return `${hours} hour${hours !== 1 ? "s" : ""}`;
    }
    if (remainingHours === 0) {
      return `${days} day${days !== 1 ? "s" : ""}`;
    }
    return `${days} day${days !== 1 ? "s" : ""} and ${remainingHours} hour${remainingHours !== 1 ? "s" : ""}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <MiniDrawer />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <MiniDrawer />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" sx={{ pb: 2 }}>
          Account Settings
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Session Duration
              </Typography>
          <Divider sx={{ mb: 2 }} />

          <TextField
            label="Session Duration (hours)"
            type="number"
            value={sessionDuration}
            onChange={(e) => setSessionDuration(e.target.value)}
            fullWidth
            margin="normal"
            inputProps={{
              min: 1,
              max: 720,
              step: 1,
            }}
            helperText={`Current value: ${convertToDays(sessionDuration)}. Valid range: 1 hour to 720 hours (30 days).`}
          />

          <FormHelperText sx={{ mt: 1, mb: 2 }}>
            Session duration determines how long users can stay logged in before
            they need to re-authenticate. Changes will apply to new logins only.
          </FormHelperText>

          <Button
            variant="contained"
            onClick={handleSaveSessionDuration}
            disabled={saving}
            sx={{ mt: 2 }}
          >
            {saving ? "Saving..." : "Save Session Duration"}
          </Button>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Password Policy
              </Typography>
          <Divider sx={{ mb: 2 }} />

          <TextField
            label="Minimum Password Length"
            type="number"
            value={passwordPolicy.length}
            onChange={(e) => setPasswordPolicy({...passwordPolicy, length: parseInt(e.target.value) || 8})}
            fullWidth
            margin="normal"
            inputProps={{
              min: 8,
              max: 128,
              step: 1,
            }}
            helperText="Minimum 8, maximum 128 characters"
          />

          <TextField
            label="Minimum Lowercase Letters"
            type="number"
            value={passwordPolicy.lowercase}
            onChange={(e) => setPasswordPolicy({...passwordPolicy, lowercase: parseInt(e.target.value) || 0})}
            fullWidth
            margin="normal"
            inputProps={{
              min: 0,
              step: 1,
            }}
            helperText="Minimum number of lowercase letters required (a-z)"
          />

          <TextField
            label="Minimum Uppercase Letters"
            type="number"
            value={passwordPolicy.uppercase}
            onChange={(e) => setPasswordPolicy({...passwordPolicy, uppercase: parseInt(e.target.value) || 0})}
            fullWidth
            margin="normal"
            inputProps={{
              min: 0,
              step: 1,
            }}
            helperText="Minimum number of uppercase letters required (A-Z)"
          />

          <TextField
            label="Minimum Numbers"
            type="number"
            value={passwordPolicy.number}
            onChange={(e) => setPasswordPolicy({...passwordPolicy, number: parseInt(e.target.value) || 0})}
            fullWidth
            margin="normal"
            inputProps={{
              min: 0,
              step: 1,
            }}
            helperText="Minimum number of numeric digits required (0-9)"
          />

          <TextField
            label="Minimum Special Characters"
            type="number"
            value={passwordPolicy.special}
            onChange={(e) => setPasswordPolicy({...passwordPolicy, special: parseInt(e.target.value) || 0})}
            fullWidth
            margin="normal"
            inputProps={{
              min: 0,
              step: 1,
            }}
            helperText="Minimum number of special characters required (!@#$%^&*, etc.)"
          />

          <FormHelperText sx={{ mt: 2, mb: 2 }}>
            Password policy settings will apply to new passwords and password changes.
            Existing passwords will not be affected until users change them.
          </FormHelperText>

          <Button
            variant="contained"
            onClick={handleSavePasswordPolicy}
            disabled={saving}
            sx={{ mt: 2 }}
          >
            {saving ? "Saving..." : "Save Password Policy"}
          </Button>
            </Paper>
          </Grid>
        </Grid>

        <Snackbar
          open={!!error || !!success}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={error ? "error" : "success"}
            sx={{ width: "100%" }}
          >
            {error || success}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default AccountSettings;
