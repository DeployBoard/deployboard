import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import { getToken } from "../../../utils/auth";
import CustomSnackbar from "../../../structure/customSnackbar";

const DeleteApiKey = ({ keyData }) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    // make the api call
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/apikeys`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ _id: keyData._id }),
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
      <IconButton
        size="small"
        onClick={handleOpen}
        sx={{
          ml: ".5rem",
          transform: "scale(.75)",
          "&:hover": {
            background: "none",
          },
        }}
      >
        <DeleteIcon />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-api-key-modal"
        aria-describedby="delete-api-key-modal"
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
          <Typography variant="h5">Delete API Key</Typography>
          <Typography>Are you sure you want to delete this key?</Typography>
          <Typography>Name: {keyData.name}</Typography>
          <Typography>Role: {keyData.role}</Typography>
          <Typography>Enabled: {keyData.enabled ? "True" : "False"}</Typography>

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
              color="error"
              onClick={handleSubmit}
            >
              Delete
            </LoadingButton>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default DeleteApiKey;
