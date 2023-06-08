import { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

const useStyles = () => ({
    commentBtns: {
        padding: '0 0.1em',
        minWidth: '3em',
    },
    bottomBtns: {
        padding: '0.15em',
    },
});

const DeleteDialog = ({ handleDelete, bodyType }) => {
    const [modelOpen, setModelOpen] = useState(false);
    const classes = useStyles();

    const handleModelOpen = () => {
        setModelOpen(true);
    }

    const handleModelClose = () => {
        setModelOpen(false);
    }

    const handleDeleteClick = () => {
        handleDelete();
        handleModelClose();
    }

    return (
        <div style={{ display: 'inline' }}>
        {bodyType === 'comment' ? (
          <Button
            size="small"
            color="primary"
            style={classes.commentBtns}
            onClick={handleModelOpen}
          >
            delete
          </Button>
        ) : (
          <Button
            size="small"
            color="primary"
            variant="contained"
            style={classes.bottomBtns}
            onClick={handleModelOpen}
          >
            Delete
          </Button>
        )}
        <Dialog open={modelOpen} onClose={handleModelClose}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`Are you sure you want to delete your ${
                bodyType ? bodyType : 'question'
              }?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleModelClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteClick} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
};

export default DeleteDialog;