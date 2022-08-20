import { useState } from "react";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/system";
import { Checkbox, TextField, Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

import { getToken } from "../../../utils/auth";
import CustomSnackbar from "../../../structure/customSnackbar";

const AddApiKey = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
    setRole("");
    setEnabled(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    // make the api call
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/apikeys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ name, role, enabled }),
      });
      // check the response status
      const status = response.status;
      // get the message from our response.
      const { message } = await response.json();
      if (status == 200) {
        setSuccess(message);
      } else {
        setError(message);
      }
      setLoading(false);
      handleClose();
    } catch (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
      handleClose();
    }
  };

  return (
    <>
      {error && <CustomSnackbar severity="error" message={error} />}
      {success && <CustomSnackbar severity="success" message={success} />}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Add API Key
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-api-key-modal"
        aria-describedby="add-api-key-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            pt: 2,
            px: 4,
            pb: 3,
          }}
        >
          <Typography variant="h5">Add API Key</Typography>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            select
            fullWidth
            label="Role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="Deploy">Deploy</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Editor">Editor</MenuItem>
            <MenuItem value="User">User</MenuItem>
          </TextField>
          <Box
            display="flex"
            justifyContent="left"
            alignItems="center"
            sx={{ mt: 2 }}
          >
            <Typography>Enabled</Typography>
            <Checkbox
              checked={enabled}
              onChange={(event) => setEnabled(event.target.checked)}
            />
          </Box>
          <br />
          <Box display="flex" justifyContent="flex-end">
            <LoadingButton
              loading={loading}
              variant="contained"
              color="primary"
              onClick={handleClose}
              sx={{ mr: ".5rem" }}
            >
              Close
            </LoadingButton>
            <LoadingButton
              loading={loading}
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Submit
            </LoadingButton>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default AddApiKey;
