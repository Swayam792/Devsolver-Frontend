import { useState } from "react";
import { useForm } from "react-hook-form";
import Comment from "./Comment.js";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Divider, Button, TextField } from "@mui/material";

const useStyles = () => ({
    smallForm: {
        marginTop: '1em',
    },
    submitCancelBtns: {
        display: 'flex',
        justifyContent: 'flex-start',
        marginTop: '0.3em',
    },
});

const validationSchema = yup.object({
    commentBody: yup.string().min(5,'Must be at least 5 characters')
});

const CommentSection = ({ user, comments, addComment, editComment, deleteComment, quesAnsId}) => {
    const classes = useStyles();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [inputOpen, setInputOpen] = useState(false);

    const { register, handleSubmit, reset, formState: {errors} } = useForm({
        mode: 'onChange',
        resolver: yupResolver(validationSchema)
    });

    const closeInput = () => {
        setInputOpen(false);
    };

    const showComments = () => {
        setIsCollapsed(false);
    };

    const handleCommentAdd = ({ commentBody }) => {
        addComment(commentBody, quesAnsId);
        showComments();
        closeInput();
        reset();
    };

    const visibleComments = isCollapsed ? comments.slice(0, 3) : comments;
    
    return (
    <div style={classes.commentSection}>
      {comments?.length !== 0 && <Divider />}
      {visibleComments?.map((c) => (
        <div key={c.id}>
          <Comment
            comment={c}
            user={user}
            quesAnsId={quesAnsId}
            editComment={editComment}
            deleteComment={deleteComment}
          />
          <Divider />
        </div>
      ))}
      {visibleComments?.length !== comments?.length ? (
        <Button size="small" color="primary" onClick={showComments}>
          show {comments?.length - visibleComments?.length} more comments
        </Button>
      ) : (
        user &&
        !inputOpen && (
          <Button
            size="small"
            color="primary"
            onClick={() => setInputOpen(true)}
          >
            add a comment
          </Button>
        )
      )}
      {inputOpen && (
        <form
          style={classes.smallForm}
          onSubmit={handleSubmit(handleCommentAdd)}
        >
          <TextField
            {...register('commentBody')}
            name="commentBody"
            required
            fullWidth
            type="text"
            placeholder="Enter at least 5 characters"
            variant="outlined"
            size="small"
            multiline
            rows={3}
            error={errors.commentBody}
            helperText={
              errors.commentBody?.message  
            }
          />
          <div style={classes.submitCancelBtns}>
            <Button
              type="submit"
              size="small"
              variant="contained"
              color="primary"
              style={{ marginRight: 9 }}
            >
              Add Comment
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => setInputOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
    );
};

export default CommentSection;