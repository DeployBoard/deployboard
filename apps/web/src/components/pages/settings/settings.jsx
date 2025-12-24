import { useState, useEffect } from "react";
import axios from "axios";
import { DateTime } from "luxon";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Grid,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import CssBaseline from "@mui/material/CssBaseline";
import MiniDrawer from "../../structure/headerDrawer";
import { getToken } from "../../utils/auth";
import useStore from "../../utils/appStore";

// Generate timezone list with GMT offsets using all IANA timezones
const getTimezoneOptions = () => {
  // Get all IANA timezones supported by the browser
  const allZones = Intl.supportedValuesOf('timeZone');
  
  return allZones.map((zone) => {
    const dt = DateTime.now().setZone(zone);
    const offset = dt.offset / 60; // Convert to hours
    const offsetHours = Math.floor(Math.abs(offset));
    const offsetMins = Math.abs(offset) % 1 * 60;
    
    // Format offset as +HH:MM or -HH:MM
    const sign = offset >= 0 ? '+' : '-';
    const offsetStr = offsetMins > 0 
      ? `${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMins).padStart(2, '0')}`
      : `${sign}${String(offsetHours).padStart(2, '0')}`;
    
    // Create friendly label
    const cityName = zone.split('/').pop().replace(/_/g, ' ');
    const gmtLabel = `(GMT${offsetStr}) ${zone.replace(/_/g, ' ')}`;
    
    return {
      value: zone,
      label: gmtLabel,
      offset: offset,
      cityName: cityName,
    };
  })
  // Sort by offset, then by timezone name
  .sort((a, b) => {
    if (a.offset !== b.offset) {
      return a.offset - b.offset;
    }
    return a.value.localeCompare(b.value);
  });
};

const Settings = () => {
  const storeTheme = useStore((state) => state.theme);
  const setStoreTheme = useStore((state) => state.setTheme);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // User profile fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [theme, setTheme] = useState(storeTheme || "system");
  const [locale, setLocale] = useState("");
  const [zoneInfo, setZoneInfo] = useState("");

  // Password change fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Generate timezone options once
  const timezoneOptions = getTimezoneOptions();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URI}/me`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      console.log("Fetched user data:", res.data);
      setFirstName(res.data.firstName || "");
      setLastName(res.data.lastName || "");
      setEmail(res.data.email || "");
      setRole(res.data.role || "");
      setTheme(res.data.theme || "system");
      setLocale(res.data.locale || "");
      setZoneInfo(res.data.zoneInfo || "");
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load user settings");
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URI}/me`,
        {
          firstName,
          lastName,
          theme,
          locale,
          zoneInfo,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setSuccess("Profile updated successfully");
      
      // Sync theme to zustand store (which persists to localStorage)
      setStoreTheme(theme);
      
      // Reload page to apply theme change
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }

    setSaving(true);

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URI}/me`,
        {
          currentPassword,
          password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
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
          User Settings
        </Typography>

        <Grid container spacing={3}>
          {/* Profile Settings */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Profile Settings
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <TextField
                label="Email"
                value={email}
                disabled
                fullWidth
                margin="normal"
                helperText="Email cannot be changed"
              />

              <TextField
                label="Role"
                value={role}
                disabled
                fullWidth
                margin="normal"
                helperText="Role is managed by administrators"
              />

              <TextField
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                fullWidth
                margin="normal"
              />

              <TextField
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                fullWidth
                margin="normal"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Theme</InputLabel>
                <Select
                  value={theme}
                  label="Theme"
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <MenuItem value="system">
                    <em>System Default</em>
                  </MenuItem>
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" disabled>
                <InputLabel>Locale</InputLabel>
                <Select
                  value={locale || "en_US"}
                  label="Locale"
                  onChange={(e) => setLocale(e.target.value)}
                >
                  <MenuItem value="en_US">English (US)</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Timezone</InputLabel>
                <Select
                  value={zoneInfo || "America/Los_Angeles"}
                  label="Timezone"
                  onChange={(e) => setZoneInfo(e.target.value)}
                >
                  {timezoneOptions.map((tz) => (
                    <MenuItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                onClick={handleSaveProfile}
                disabled={saving}
                sx={{ mt: 2 }}
              >
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </Paper>
          </Grid>

          {/* Password Change */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Change Password
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <TextField
                label="Current Password"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
                margin="normal"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          edge="end"
                        >
                          {showCurrentPassword ? (
                            <VisibilityOffRoundedIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                margin="normal"
                helperText="Must be at least 8 characters"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          {showNewPassword ? (
                            <VisibilityOffRoundedIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                margin="normal"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOffRoundedIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                variant="contained"
                onClick={handleChangePassword}
                disabled={saving}
                sx={{ mt: 2 }}
              >
                {saving ? "Changing..." : "Change Password"}
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

export default Settings;
