import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { LinearProgress } from "@mui/material";

const AddService = gql`
  mutation Mutation($record: CreateOneServiceInput!) {
    serviceCreateOne(record: $record) {
      record {
        _id
        service
        account
        environments {
          name
          status
          version
          timestamp
        }
      }
    }
  }
`;

export default function FormDialog() {
  const [open, setOpen] = useState(false);
  const [mutateFunction, { data, loading, error }] = useMutation(AddService, {
    variables: {
      record: {
        service: "payment",
        account: "deployboard.io",
      },
    },
  });

  if (data) {
    console.log(data);
  }
  if (loading) return <LinearProgress />;
  // TODO: display snackbar at top right when error occurs.
  if (error) return `Submission error! ${error.message}`;

  const handleClickOpen = () => {
    console.log("open");
    setOpen(true);
  };

  const handleClose = () => {
    console.log("close");
    setOpen(false);
  };

  const handleSubmit = () => {
    console.log("submit");
    mutateFunction();
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Service
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Service</DialogTitle>
        <DialogContent>
          <DialogContentText>Add a service.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
