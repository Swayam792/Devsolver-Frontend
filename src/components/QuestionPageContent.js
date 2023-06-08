import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useAuthContext } from "../context/authContext";
import { useStateContext } from "../context/stateContext";
import { ADD_QUES_COMMENT, DELETE_QUESTION, DELETE_QUES_COMMENT, VOTE_QUESTION, EDIT_QUES_COMMENT } from "../graphql/mutations"; 
import { getErrorMsg } from "../utils/helperFunction";
import { upvote, downvote } from "../utils/voteQuesAns.js";
import { VIEW_QUESTION } from "../graphql/queries.js";
import QuestionAnswerDetails  from "./QuestionAnswerDetails.js";
import { Divider } from "@mui/material";
import AnswerList from "./AnswerList";
import AnswerForm from "./AnswerForm";

const useStyles = () => ({    
    content: {
        paddingTop: '0.5em',
        width: '100%',
        paddingBottom: '1em',
    }, 
});
 
const QuestionPageContent = ({ question }) => {
    const {id : quesId, answers, acceptedAnswer, upvotedBy, downvotedBy, title, body, tags, author} = question;

    const { user } = useAuthContext();
    const { setEditValues, notify } = useStateContext();
    const classes = useStyles();
    const navigate = useNavigate();

    const [submitVote] = useMutation(VOTE_QUESTION, {
        onError: (err) => {
            notify(getErrorMsg(err), 'error');
        }
    });

    const [removeQuestion] = useMutation(DELETE_QUESTION, {
        onError: (err) => {
            notify(getErrorMsg(err), 'error');
        }
    });

    const [postQuesComment] = useMutation(ADD_QUES_COMMENT, {
        onError: (err) => {
            notify(getErrorMsg(err), 'error');
        }
    });

    const [updateQuesComment] = useMutation(EDIT_QUES_COMMENT, {
        onError: (err) => {
            notify(getErrorMsg(err), 'error');
        }
    });

    const [removeQuesComment] = useMutation(DELETE_QUES_COMMENT, {
        onError: (err) => {
            notify(getErrorMsg(err), 'error');
        }
    });

    const upvoteQues = () => {
        const { updatedUpvotedArr, updatedDownvotedArr, updatedPoints} = upvote(upvotedBy, downvotedBy, user);
        console.log(updatedUpvotedArr, updatedDownvotedArr, updatedPoints)
        submitVote({
            variables: { quesId, voteType: 'UPVOTE'},
            optimisticResponse: {
                __typename: 'Mutation',
                voteQuestion: {
                    __typename: 'Question',
                    id: quesId,
                    upvotedBy: updatedUpvotedArr,
                    downvotedBy: updatedDownvotedArr,
                    points: updatedPoints
                }
            }
        });
    };

    const downvoteQues = () => {
        const { updatedUpvotedArr, updatedDownvotedArr, updatedPoints} = downvote(upvotedBy, downvotedBy, user);

        submitVote({
            variables: { quesId, voteType: 'DOWNVOTE'},
            optimisticResponse: {
                __typename: 'Mutation',
                voteQuestion: {
                    __typename: 'Question',
                    id: quesId,
                    upvotedBy: updatedUpvotedArr,
                    downvotedBy: updatedDownvotedArr,
                    points: updatedPoints
                }
            }
        })
    };

    const editQues = () => {
        setEditValues({ quesId, title, body, tags});
        navigate('/ask');
    };

    const deleteQues = () => {
        removeQuestion({
            variables: { quesId },
            update: () => {
                navigate('/');
                notify('Question deleted!');
            }
        });
    };

    const addQuesComment = (comment) => {
        postQuesComment({
            variables: {quesId, body: comment},
            update: (proxy, { data }) => {
                const dataInCache = proxy.readQuery({
                    query: VIEW_QUESTION,
                    variables: {quesId}
                });
                const updatedData = {
                    ...dataInCache.viewQuestion,
                    comments: data.addQuesComment
                }; 
                
                proxy.writeQuery({
                    query: VIEW_QUESTION,
                    variables: { quesId },
                    data: { viewQuestion: updatedData}
                });

                notify('Comment added to question!');
            }
        });
    };

    const editQuesComment = (commentId, editedCommentBody) => {
        updateQuesComment({
            variables: { quesId, commentId, body: editedCommentBody},
            update: () => {
                notify('Comment edited!');
            }
        });
    };

    const deleteQuesComment = (commentId) => {
        removeQuesComment({
            variables: { quesId, commentId },
            update: (proxy, { data }) => {
                const dataInCache = proxy.readQuery({
                    query: VIEW_QUESTION,
                    variables: { quesId },
                });
          
                const filteredComments = dataInCache.viewQuestion.comments.filter(
                    (c) => c.id !== data.deleteQuesComment
                );
          
                const updatedData = {
                    ...dataInCache.viewQuestion,
                    comments: filteredComments,
                };
          
                proxy.writeQuery({
                    query: VIEW_QUESTION,
                    variables: { quesId },
                    data: { viewQuestion: updatedData },
                });
          
                notify('Comment deleted!');
            }
        });
    };
 
    
    return (
    <div style={classes.content}>
        <QuestionAnswerDetails
          quesAns={question}
          upvoteQuesAns={upvoteQues}
          downvoteQuesAns={downvoteQues}
          editQuesAns={editQues}
          deleteQuesAns={deleteQues}
          addComment={addQuesComment}
          editComment={editQuesComment}
          deleteComment={deleteQuesComment}
        /> 
        <Divider />
        <AnswerList
          quesId={quesId}
          answers={answers}
          acceptedAnswer={acceptedAnswer}
          quesAuthor={author}
        />
        <AnswerForm quesId={quesId} tags={tags} />
    </div>
    );
};

export default QuestionPageContent;