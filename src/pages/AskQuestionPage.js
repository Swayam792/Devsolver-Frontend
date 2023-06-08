import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'; 
import { useStateContext } from "../context/stateContext";
import { useMutation } from "@apollo/client";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { getErrorMsg } from "../utils/helperFunction";
import { EDIT_QUESTION, POST_QUESTION } from "../graphql/mutations";
import { useTheme } from "@emotion/react";
import { Autocomplete, Chip, InputAdornment, TextField, Typography, useMediaQuery, Button } from "@mui/material";
import { useAuthContext } from "../context/authContext";
import ErrorMessage from "../components/ErrorMessage";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import modules from "../utils/customEditor.js";

const useStyles = () => ({
    root: {
        width: '100%',
        marginTop: '1em',
        padding: '0.4em 1em',
    },
    quesForm: {
        paddingTop: '0.8em',
    },
    inputWrapper: {
        marginBottom: '2em',
    },
    inputWrapper2: {
      marginTop: "5em",
      marginBottom: '2em',
      mobileStyle: {
        marginTop: "8em",
        marginBottom: "1em"
      }
    },
    inputField: {
        marginTop: '0.4em',
    },
    submitBtn: {
        mobileStyle: {
            width: '100%',
        },
    },
    tag: {
        marginRight: '0.5em',
    },
});

const validateSchema = yup.object({
    title: yup.string().required('Required').min(15, 'Must be atleast 15 characters'),
    body: yup.string().required('Required').min(30, 'Must be atleast 30 characters')
});

const AskQuestionPage = () => {
    const { user } = useAuthContext();
    const theme = useTheme();
    const classes = useStyles();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isDesktop = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const { editValues, clearEdit, notify } = useStateContext();
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState(editValues ? editValues.tags : []);
    const [errorMsg, setErrorMsg] = useState(null); 
    const { register, handleSubmit, watch, setValue,reset, formState: {errors}} = useForm({
        defaultValues: {
            title: editValues ? editValues.title : "",
            body: editValues ? editValues.body : "",
        },
        mode: 'onChange',
        resolver: yupResolver(validateSchema)
    });

    useEffect(() => {
      register("body",{ required: true, minLength: 30 });
    },[register]);

    const [postQuestion, { loading: addQuestionLoading}] = useMutation(POST_QUESTION, {
        onError: (err) => {
          setErrorMsg(getErrorMsg(err));
        }
    });

    const [updateQuestion, { loading: editQuestionLoading}] = useMutation(EDIT_QUESTION, {
        onError: (err) => {
            setErrorMsg(getErrorMsg(err))
        }
    });

    const AddQuestion = ({ title, body}) => {
        if(tags.length === 0) return setErrorMsg('Atleast one tag should be added.'); 
        console.log(title, body, tags); 
        postQuestion({
            variables: { title, body, tags },
            update: (_, { data }) => {
              navigate(`/questions/${data.postQuestion.id}`);
              reset();
              notify('Question posted!');
            },
        });
    };

    const editQuestion = ({ title, body }) => {
        if(tags.length === 0) return setErrorMsg('Atleast one tag should be added.');

        updateQuestion({
            variables: { quesId: editValues.quesId, title, body, tags},
            update: (_, { data }) => {
                navigate(`/questions/${data.editQuestion.id}`);
                clearEdit();
                notify('Question edited!');
            }
        });
    };

    const handleTags = (e) => {
        if(!e || (!e.target.value && e.target.value !== ''))return;
        const value = e.target.value.toLowerCase().trim();
        setTagInput(value);

        const keyCode = e.target.value
        .charAt(e.target.selectionStart - 1)
        .charCodeAt();  

        if(keyCode == 32 && value.trim() !== ''){             
            if(tags.includes(value)){
                return setErrorMsg("Duplicate tag found! You can't add the same tag twice.");
            }
            console.log(value.length);
            if(!/^[a-zA-Z0-9-]*$/.test(value)){
                return setErrorMsg('Only alphanumeric characters & dash are allowed.');
            }

            if(tags.length >= 5){
                setTagInput('');
                return setErrorMsg('Max 5 tags can be added! Not more than that.');
            }

            if(value.length > 30){
                return setErrorMsg("A single tag can't have more than 30 characters.");
            }
            console.log(value);
            setTags((prevTags) => [...prevTags, value]);
            setTagInput("");
        }
    }
     
    const handleBodyChange = (editorState) => {
        setValue("body",editorState);
    }
    const editorContent = watch("body");
    if(!user){
        return navigate('/');
    }
 
    return (
    <div style={classes.root}>
        <Typography variant="h5" color="secondary">
          {editValues ? 'Edit Your Question' : 'Ask A Question'}
        </Typography>
        <form
          style={classes.quesForm}
          onSubmit={
            editValues ? handleSubmit(editQuestion) : handleSubmit(AddQuestion)
          }
        >
          <div style={classes.inputWrapper}>
            <Typography variant="caption" color="secondary">
              Be specific and imagine you’re asking a question to another person
            </Typography>
            <TextField
              required
              fullWidth
              {...register('title')}
              name="title"
              placeholder="Enter atleast 15 characters"
              type="text"
              label="Title"
              variant="outlined"
              size="small"
              error={errors.title}
              helperText={errors.title?.message}
              style={classes.inputField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <div></div>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div style={classes.inputWrapper}>
            <Typography variant="caption" color="secondary">
              Include all the information someone would need to answer your
              question
            </Typography>
            {/* <TextField
              required
              multiline
              rows={5}
              fullWidth
              {...register("body")}
              name="body"
              placeholder="Enter atleast 30 characters"
              type="text"
              label="Body"
              variant="outlined"
              size="small"
              error={errors.body}
              helperText={errors.body?.message}
              style={classes.inputField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <div></div>
                  </InputAdornment>
                ),
              }}
            /> */}
            <ReactQuill  
              theme="snow"
              modules={modules} 
              name="body"  
              style={{ height: "200px" }} 
              value={editorContent}
              onChange={handleBodyChange}
              placeholder="Enter atleast 30 characters"  
              className="react-quill"                           
            />
          </div>
          <div style={!isDesktop ? classes.inputWrapper2: classes.inputWrapper2.mobileStyle}>
            <Typography variant="caption" color="secondary">
              Add up to 5 tags to describe what your question is about
            </Typography>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              getOptionLabel={(option) => option}
              value={tags}
              inputValue={tagInput}
              onInputChange={handleTags}
              onChange={(e, value, reason) => {
                setTags(value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Tags"
                  placeholder="Press space button to add tags"
                  onKeyDown={handleTags}
                  fullWidth
                  style={classes.inputField}
                  size="small"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    color="primary"
                    size="small"
                    {...getTagProps({ index })}
                  />
                ))
              }
            />
          </div>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            size="large"
            style={!isMobile ? classes.submitBtn: classes.submitBtn.mobileStyle}
            disabled={addQuestionLoading || editQuestionLoading}
          >
            {editValues ? 'Update Your Question' : 'Post Your Question'}
          </Button>
          <ErrorMessage
            errorMsg={errorMsg} 
            clearErrorMsg={() => setErrorMsg(null)}
          />
        </form>
    </div>
    );
};

export default AskQuestionPage;