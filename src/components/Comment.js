import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import DeleteDialog from "./DeleteDialog.js";
import { formatDayTime } from "../utils/helperFunction";

import { Typography, Link, Button, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit.js";

const useStyles = () => ({      
    content: {
        paddingTop: '0.5em',
        width: '100%',
        paddingBottom: '1em',
    },       
    tag: {
        marginRight: '0.5em',
        marginTop: '0.5em',
    },    
    commentWrapper: {
        padding: '0.5em 0.2em',
    },
    commentBtns: {
        padding: '0 0.1em',
        minWidth: '3em',
    },
    smallForm: {
        marginTop: '1em',
    },
    submitCancelBtns: {
        display: 'flex',
        justifyContent: 'flex-start',
        marginTop: '0.3em',
    }, 
    acceptIcon: {
        color: '#aa9aaa',
        fontSize: 32,
    },
});

const Comment = ({ comment, user, quesAnsId, editComment, deleteComment}) => {
    const [editOpen, setEditOpen] = useState(false);
    const [editedCommentBody, setEditedCommentBody] = useState(comment.body);
    const classes = useStyles();

    useEffect(() => {
        setEditedCommentBody(comment.body);
    }, [comment]);

    const closeInput = () => {
        setEditOpen(false);
    }

    const handleCommentEdit = (e) => {
        e.preventDefault();
        editComment(editedCommentBody, comment.id, quesAnsId);
        closeInput();
    };

    return (
    <div style={classes.commentWrapper}>
      {!editOpen ? (
        <div>
          <Typography variant="caption" style={{ wordWrap: 'anywhere' }}>
            {comment.body} –{' '}
            <Link
              component={RouterLink}
              to={`/user/${comment.author.username}`}
            >
              {comment.author.username}
            </Link>
            <Typography variant="caption" color="secondary">
              {` ${formatDayTime(comment.createdAt)} `}
            </Typography>
            {comment.createdAt !== comment.updatedAt && (
              <EditIcon fontSize="inherit" color="secondary" />
            )}
          </Typography>
          {user && user.id === comment.author.id && (
            <Button
              size="small"
              color="primary"
              style={classes.commentBtns}
              onClick={() => setEditOpen(true)}
            >
              edit
            </Button>
          )}
          {user && (user.id === comment.author.id || user.role === 'ADMIN') && (
            <DeleteDialog
              bodyType="comment"
              handleDelete={() => deleteComment(comment.id, quesAnsId)}
            />
          )}
        </div>
      ) : (
        <form style={classes.smallForm} onSubmit={handleCommentEdit}>
          <TextField
            value={editedCommentBody}
            required
            fullWidth
            type="text"
            placeholder="Enter at least 5 characters"
            variant="outlined"
            size="small"
            multiline
            rows={2}
            onChange={(e) => setEditedCommentBody(e.target.value)}
          />
          <div style={classes.submitCancelBtns}>
            <Button
              type="submit"
              size="small"
              variant="contained"
              color="primary"
              style={{ marginRight: 9 }}
            >
              Update Comment
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
    );
};

export default Comment;