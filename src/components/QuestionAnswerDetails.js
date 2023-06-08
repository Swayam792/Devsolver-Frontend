import { useState, useEffect } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { useAuthContext } from "../context/authContext";
import { UpvoteButton, DownvoteButton } from "./VoteButtons.js";
import PostedByUser from "./PostedByUser.js";
import AuthModel from "./AuthModel.js";
import CommentSection from "./CommentSection.js"; 
import AcceptAnswerButton from "./AcceptAnswerButton";
import DeleteDialog from "./DeleteDialog.js"; 
import {ReactComponent as AcceptedIcon} from "../assets/accepted.svg";
import { Typography, SvgIcon, TextField, Button, Chip, useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.bubble.css'

const useStyles = () => ({   
    content: {
        paddingTop: '0.5em',
        width: '100%',
        paddingBottom: '1em',
    },
    quesAnsWrapper: {
        display: 'flex',
        marginBottom: '1em',
    },
    voteColumn: {
        display: 'flex',
        flexDirection: 'column',
        width: 30,
        alignItems: 'center',
    },
    quesBody: {
        padding: '0.6em 1em',
        paddingBottom: 0,
        width: '100%',
        mobileStyle: {
          paddingRight: '0',
        },
    },
    tag: {
        marginRight: '0.5em',
        marginTop: '0.5em',
    },
    tagsWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: '1em',
    },
    bottomWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: '1.4em',
        marginBottom: '0.8em',
    },
    bottomBtns: {
        padding: '0.15em',
        marginRight: '6px'
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
    checkedAcceptIcon: {
        color: '#2e8b57',
        fontSize: 32,
    },
});

const QuestionAnswerDetails = ({ quesAns, upvoteQuesAns, downvoteQuesAns, editQuesAns, deleteQuesAns, addComment, editComment, deleteComment, acceptAnswer, isAnswer, acceptedAnswer, quesAuthor }) => {
    const { id, author, body, tags, comments, points, upvotedBy, downvotedBy, createdAt, updatedAt} = quesAns;
    const theme = useTheme();
    const classes = useStyles();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user } = useAuthContext();
    const [editAnsOpen, setEditAnsOpen] = useState(false);
    const [editedAnswerBody, setEditedAnswerBody] = useState(body);

    useEffect(() => {
        if(isAnswer){
            setEditedAnswerBody(body);
        } 
    },[body]);

    const openEditInput = () => {
        setEditAnsOpen(true);
    }

    const closeEditInput = () => {
        setEditAnsOpen(false);
    }

    const handleAnswerEdit = (e) => {
        e.preventDefault();
        editQuesAns(editedAnswerBody, id);
        closeEditInput(); 
    }
    return (
    <div style={classes.quesAnsWrapper}>
      <div style={classes.voteColumn}>
        {user ? (
          <UpvoteButton
            checked={user ? upvotedBy?.includes(user.id) : false}
            user={user}
            handleUpvote={upvoteQuesAns}
          />
        ) : (
          <AuthModel buttonType="upvote" />
        )}
        <Typography variant="h6" color="secondary">
          {points}
        </Typography>
        {user ? (
          <DownvoteButton
            checked={user ? downvotedBy?.includes(user.id) : false}
            user={user}
            handleDownvote={downvoteQuesAns}
          />
        ) : (
          <AuthModel buttonType="downvote" />
        )}
        {isAnswer && user && user.id === quesAuthor.id && (
          <AcceptAnswerButton
            checked={acceptedAnswer === id}
            handleAcceptAns={acceptAnswer}
          />
        )}
        {isAnswer &&
          acceptedAnswer === id &&
          (!user || user.id !== quesAuthor.id) && (
            <SvgIcon style={classes.checkedAcceptIcon}>
              <AcceptedIcon />
            </SvgIcon>
          )}
      </div>
      <div style={!isMobile ? classes.quesBody: classes.quesBody.mobileStyle}>
        {!editAnsOpen ? (
          // <Typography variant="body1" style={{ wordWrap: 'anywhere' }}>
          //   {body}
          // </Typography>
          <ReactQuill value={body} readOnly={true} theme={"bubble"}/>
        ) : (
          <form style={classes.smallForm} onSubmit={handleAnswerEdit}>
            <TextField
              value={editedAnswerBody}
              required
              fullWidth
              onChange={(e) => setEditedAnswerBody(e.target.value)}
              type="text"
              placeholder="Enter at least 30 characters"
              variant="outlined"
              size="small"
              multiline
              rows={4}
            />
            <div style={classes.submitCancelBtns}>
              <Button
                type="submit"
                size="small"
                variant="contained"
                color="primary"
                style={{ marginRight: 9 }}
              >
                Update Answer
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => setEditAnsOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
        {tags && (
          <div style={classes.tagsWrapper}>
            {tags.map((t) => (
              <Chip
                key={t}
                label={t}
                variant="outlined"
                color="primary"
                size="small"
                component={RouterLink}
                to={`/tags/${t}`}
                style={classes.tag}
                clickable
              />
            ))}
          </div>
        )}
        <div style={classes.bottomWrapper}>
          {!editAnsOpen && (
            <div style={classes.btnsWrapper}>
              {user && user.id === author?.id && (
                <Button
                  size="small"
                  color="primary"
                  variant="contained" 
                  style={classes.bottomBtns}
                  onClick={isAnswer ? openEditInput : editQuesAns}
                >
                  Edit
                </Button>
              )}
              {user && (user.id === author?.id || user.role === 'ADMIN') && (
                <DeleteDialog
                  bodyType={isAnswer ? 'answer' : 'question'}
                  handleDelete={deleteQuesAns}
                />
              )}
            </div>
          )}
          <PostedByUser
            username={author?.username}
            userId={author?.id}
            createdAt={createdAt}
            updatedAt={updatedAt}
            filledVariant={true}
            isAnswer={isAnswer}
          />
        </div>
        <CommentSection
          user={user}
          comments={comments}
          addComment={addComment}
          editComment={editComment}
          deleteComment={deleteComment}
          quesAnsId={id}
        />
      </div>
    </div>
    );
};

export default QuestionAnswerDetails;