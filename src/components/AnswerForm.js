import { useForm } from "react-hook-form";
import {Link as RouterLink} from "react-router-dom";
import { useMutation } from "@apollo/client"; 
import { POST_ANSWER } from "../graphql/mutations";
import { VIEW_QUESTION } from "../graphql/queries";
import { useAuthContext } from "../context/authContext";
import { useStateContext } from "../context/stateContext";
import AuthModel from "./AuthModel";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { getErrorMsg } from "../utils/helperFunction";
import { Typography, Button, TextField, Chip, Link, useMediaQuery } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import modules from "../utils/customEditor.js";
import { useTheme } from "@emotion/react";

const useStyles = () => ({
  answerForm: {
    marginTop: '2em'
  },   
  footerText: {
    marginTop: '1em',
    marginBottom: '1em',
    display: 'flex',
    alignItems: 'flex-start',
  },
  postBtnStyle: {
    marginTop: '6.5em',
    mobileStyle: {
      marginTop: '9em'
    }
  },
  footerTag: {
    marginRight: '0.5em',
  },
});

const validateSchema = yup.object({
    answerBody: yup.string().min(30, 'Must be at least 30 characters')
});

const AnswerForm = ({ quesId, tags }) => {
    const classes = useStyles();
    const { user } = useAuthContext();
    const { clearEdit, notify } = useStateContext();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { register, handleSubmit, watch, setValue ,reset, formState: {errors}} = useForm({
        mode: 'onChange',
        resolver: yupResolver(validateSchema)
    });

    const [addAnswer, { loading }] = useMutation(POST_ANSWER, {
        onError: (err) => {
            notify(getErrorMsg(err), 'error');  
        }
    });

    const postAnswer = ({ answerBody }) => {
        addAnswer({
            variables: { quesId, body: answerBody},
            update: (proxy, { data }) => {
                reset();
                const dataInCache = proxy.readQuery({
                    query: VIEW_QUESTION,
                    variables: { quesId },
                });

                const updatedData = {
                    ...dataInCache.viewQuestion,
                    answers: data.postAnswer,
                };
          
                proxy.writeQuery({
                    query: VIEW_QUESTION,
                    variables: { quesId },
                    data: { viewQuestion: updatedData },
                });
          
                notify('Answer submitted!');
            }
        });
    };
    const editorContent = watch("answerBody");
    const handleAnswerBodyChange = (editorState) => {
      setValue("answerBody",editorState);
    }

    return (
    <div style={classes.answerForm}>
      {user && (
        <Typography variant="h6" color="secondary">
          Your Answer
        </Typography>
      )}
      {user && (
        <form onSubmit={handleSubmit(postAnswer)}>
          {/* <TextField
            {...register('answerBody')}
            name="answerBody"
            required
            fullWidth
            type="text"
            placeholder="Enter atleast 30 characters"
            variant="outlined"
            size="small"
            error={errors.answerBody}
            helperText={errors.answerBody?.message}
            multiline
            rows={5}
          /> */}
          <ReactQuill  
              theme="snow"
              modules={modules} 
              name="answerBody"  
              style={{ height: "250px" }} 
              value={editorContent}
              onChange={handleAnswerBodyChange}
              placeholder="Enter atleast 30 characters"  
              className="react-quill"                           
          />
          <div>
            <Button
              color="primary"
              variant="contained"
              style={!isMobile ? classes.postBtnStyle : classes.postBtnStyle.mobileStyle }
              type="submit"
              disabled={loading}
            >
              Post Your Answer
            </Button>
          </div>
        </form>
      )}
      <div style={classes.footerText}>
        <span>
          Browse other questions tagged{' '}
          {tags.map((t) => (
            <Chip
              key={t}
              label={t}
              variant="outlined"
              color="primary"
              size="small"
              component={RouterLink}
              to={`/tags/${t}`}
              style={classes.footerTag}
              clickable
            />
          ))}
          or{' '}
          {user ? (
            <Link component={RouterLink} to="/ask" onClick={() => clearEdit()}>
              ask your own question.
            </Link>
          ) : (
            <AuthModel buttonType="link" />
          )}
        </span>
      </div>
    </div>
    );    
}

export default AnswerForm;