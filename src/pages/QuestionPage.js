import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useStateContext } from "../context/stateContext.js";
import { useAuthContext } from "../context/authContext.js";
import { useMediaQuery, Typography, Button, Divider, Grid } from "@mui/material";
import { useTheme } from '@emotion/react';
import { VIEW_QUESTION } from '../graphql/queries.js';
import { useLazyQuery } from '@apollo/client';
import {formatDateAgo, getErrorMsg } from '../utils/helperFunction.js';
import AuthModel from '../components/AuthModel.js'; 
import Spinner from "../components/Spinner.js";
import RightSidePanel from "../components/RightSidePanel.js";
import QuestionPageContent from '../components/QuestionPageContent.js';

const useStyles = () => ({
    root: {
        width: '100%',
        paddingLeft: '0.7em',
        marginTop: '1em',
        mobileStyle: {
          paddingRight: '0.7em',
        },
    },
    topBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        mobileStyle: {
          paddingLeft: '0.4em',
          paddingRight: '0.4em',
        },
    },
    titleWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingBottom: '0.4em',
        width: '100%',
        mobileStyle: {
          flexWrap: 'wrap',
        },
    },
    quesInfo: {
        display: 'flex',
        paddingBottom: '0.8em',
    },
});

const QuestionPage = () => {
    const { clearEdit, notify } = useStateContext();
    const { user } = useAuthContext();
    const { quesId } = useParams();
    const [question, setQuestion] = useState();
    const theme = useTheme();
    const classes = useStyles();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [fetchQuestion, { data, loading }] = useLazyQuery(VIEW_QUESTION, {
        onError: (err) => {
            notify(getErrorMsg(err), 'error');
        }
    });

    useEffect(() => {
        fetchQuestion({ variables: { quesId } }); 
    },[quesId]);

    useEffect(() => {
        if(data) {
            setQuestion(data.viewQuestion);
        }
    },[data]);

    if(loading || !question){
        return (
            <div style={{ minWidth: '100%', marginTop: '20%' }}>
                <Spinner size={80} />
            </div>
        );
    }

    const { title, views, createdAt, updatedAt } = question;

    return (
    <div style={!isMobile ? classes.root: classes.root.mobileStyle}>
      <div style={!isMobile ? classes.topBar: classes.topBar.mobileStyle}>
        <div style={!isMobile ? classes.titleWrapper: classes.titleWrapper.mobileStyle}>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            color="secondary"
            style={{ wordWrap: 'anywhere' }}
          >
            {title}
          </Typography>
          {user ? (
            <Button
              variant="contained"
              color="primary"
              size={isMobile ? 'small' : 'medium'}
              component={RouterLink}
              to="/ask"
              onClick={() => clearEdit()}
              style={{ minWidth: '9em' }}
            >
              Ask Question
            </Button>
          ) : (
            <AuthModel buttonType="ask" />
          )}
        </div>
        <div style={classes.quesInfo}>
          <Typography variant="caption" style={{ marginRight: 10 }}>
            Asked <strong>{formatDateAgo(createdAt)} ago</strong>
          </Typography>
          {createdAt !== updatedAt && (
            <Typography variant="caption" style={{ marginRight: 10 }}>
              Edited <strong>{formatDateAgo(updatedAt)} ago</strong>
            </Typography>
          )}
          <Typography variant="caption">
            Viewed <strong>{views} times</strong>
          </Typography>
        </div>
      </div>
      <Divider />
      <Grid container direction="row" wrap="nowrap" justify="space-between">
        <QuestionPageContent question={question} />
        <RightSidePanel />
      </Grid>
    </div>
    );
};

export default QuestionPage;