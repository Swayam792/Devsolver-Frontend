import { useState, useEffect } from "react";
import {useParams, Link as RouterLink, useNavigate} from "react-router-dom";
import {useTheme} from "@emotion/react";
import {useStateContext} from "../context/stateContext.js";
import { useLazyQuery } from "@apollo/client";
import { GET_USER } from "../graphql/queries.js";
import Spinner from "../components/Spinner.js";
import { Avatar, Typography, Divider, Button } from '@mui/material';
import { formatDateAgo, getErrorMsg } from '../utils/helperFunction.js';
import RecentQuestions from "../components/RecentQuestions.js";
import MessageRightSideBox from "../components/MessageRightSideBox.js";
import { useAuthContext } from "../context/authContext.js";

const useStyles = (theme) => ({
    root: {
        marginTop: '1em',
        padding: '0em 1.4em',
        width: '100%',
        display: 'flex',
        mobileStyle: {
          flexDirection: 'column',
          padding: '0em 0.9em',
        },
      },
      userCard: {
        backgroundColor: `${theme.palette.primary.main}15`,
        padding: '1.6em',
        height: '14.5em',
        textAlign: 'center',
        mobileStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '9.5em',
          marginBottom: '0.5em',
        },
      },
      avatar: {
        width: theme.spacing(21),
        height: theme.spacing(21),
        borderRadius: 3,
        mobileStyle: {
          width: theme.spacing(15),
          height: theme.spacing(15),
        },
      },
      cardText: {
        marginTop: '0.5em'
      },
      infoCard: {
        paddingLeft: '2em',
        paddingRight: '2em',
        width: '100%',
        mobileStyle: {
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
      userInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      },
      bigText: {
        mobileStyle: {
          fontSize: '1.5em',
        },
      },
      smallText: {
        mobileStyle: {
          fontSize: '0.8em',
        },
      },
      statsBar: {
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
      },
      recentActivity: {
        marginTop: '1em',
      },
      recentQuesAns: {
        display: 'flex',
        padding: '0.5em 0',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      votesTitleWrapper: {
        display: 'flex',
        alignItems: 'center',
      },
      votes: {
        padding: '0.2em 0.5em',
        border: '1px solid #d3d3d3',
        marginRight: '0.7em',
        mobileStyle: {
          marginRight: '0.5em',
        },
      },
      title: {
        textDecoration: 'none',
        '&:hover': {
          filter: 'brightness(200%)',
        },
        transition: 'all 0.4s ease',
      },
});

const UserPage = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const {user} = useAuthContext();
    const navigate = useNavigate();
    const { notify } = useStateContext();
    const { username } = useParams();
    const [fetchedUser, setFetchedUser] = useState(null);

    const [fetchUser, { data, loading} ] = useLazyQuery(GET_USER, {
      fetchPolicy: 'no-cache',
      onError: (err) => {
        notify(getErrorMsg(err), 'error');
      }
    });

    useEffect(() => {
      fetchUser({ variables: {username}});
    },[username]);

    useEffect(() => {
        if(data){ 
        setFetchedUser(data.getUser);
      }
    }, [data]);

    
    if(loading || !fetchedUser){
      return (
        <div style={{ minWidth: '100%', marginTop: '20%'}}>
          <Spinner size={80} />
        </div>
      );
    }
    
    const {id, username: userName, createdAt, reputation, totalQuestions, totalAnswers, recentQuestions, recentAnswers} = fetchedUser;
    const handleMessageClick = () => {
       navigate("/messages", {state: {username, id}});
    }
    return (  
    <div style={classes.root}>
      <div style={classes.userCard}>
        <Avatar
          src={`https://secure.gravatar.com/avatar/${id}?s=164&d=identicon`}
          alt={username}
          style={classes.avatar}
          component={RouterLink}
          to={`/user/${username}`}
        />
        <Typography variant="h5" color="secondary" style={classes.cardText}>
          {reputation} <Typography variant="caption">REPUTATION</Typography>
        </Typography>
        {user?.id.toString() !== id.toString() &&  <Button onClick={() => handleMessageClick()} color="primary" style={classes.cardText}>
           Message now
        </Button>
         }
      </div>
        
      <div style={classes.infoCard}>
        <div style={classes.userInfo}>
          <div>
            <Typography
              variant="h4"
              color="primary"
              style={classes.bigText}
            >
              {userName}
            </Typography>
            <Typography
              variant="body1"
              color="secondary"
              style={classes.smallText}
            >
              member for {formatDateAgo(createdAt)}
            </Typography>
          </div>
          <div style={classes.statsBar}>
            <div style={{ marginRight: 10 }}>
              <Typography
                variant="h4"
                color="primary"
                style={classes.bigText}
              >
                {totalAnswers}
              </Typography>
              <Typography
                variant="body1"
                color="secondary"
                style={classes.smallText}
              >
                answers
              </Typography>
            </div>
            <div>
              <Typography
                variant="h4"
                color="primary"
                style={classes.bigText}
              >
                {totalQuestions}
              </Typography>
              <Typography
                variant="body1"
                color="secondary"
                style={classes.smallText}
              >
                questions
              </Typography>
            </div>
          </div>
        </div>
        <Divider />
        <div style={classes.recentActivity}>
          <div style={{ marginBottom: '1em' }}>
            <Typography variant="h6" color="primary">
              Last Asked Questions
            </Typography>
            <Divider />
            {recentQuestions?.length !== 0 ? (
              recentQuestions.map((q) => (
                <div key={q.id}>
                  <RecentQuestions question={q} /> 
                  <Divider />
                </div>
              ))
            ) : (
              <Typography variant="subtitle1">
                No questions asked yet.
              </Typography>
            )}
          </div>
          <div>
            <Typography variant="h6" color="primary">
              Last Answered Questions
            </Typography>
            <Divider />
            {recentAnswers?.length !== 0 ? (
              recentAnswers.map((q) => (
                <div key={q.id}>
                  <RecentQuestions question={q} /> 
                  <Divider />
                </div>
              ))
            ) : (
              <Typography variant="subtitle1">
                No questions answered yet.
              </Typography>
            )}
          </div>
        </div>
      </div>
    </div>
    );
}

export default UserPage;