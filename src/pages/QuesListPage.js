import { Typography, useMediaQuery, Button, Divider} from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useAuthContext } from '../context/authContext';
import { useTheme } from '@emotion/react';
import {GET_QUESTIONS} from "../graphql/queries.js";
import { useLazyQuery } from '@apollo/client'; 
import { getErrorMsg } from '../utils/helperFunction';
import { filterDuplicates } from '../utils/helperFunction';
import { useStateContext } from '../context/stateContext';
import AuthModel from "../components/AuthModel";
import Spinner from '../components/Spinner';
import SortQuestionBar from '../components/SortQuestionBar';
import QuestionCard from '../components/QuestionCard';
import LoadMoreButton from '../components/LoadMoreButton';

const useStyles = () => ({
    root: {
        width: '100%',
        marginTop: '1em',
        padding: '0.4em 0.7em',
        mobileStyle: {
            paddingLeft: '0.3em',
            paddingRight: '0.3em'
        }
    },
    topBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        mobileStyle: {
            padingLeft: '0.4em',
            paddingRight: '0.4em'
        }
    },      
    noQuesText: {
      textAlign: 'center',
      marginTop: '2em',
    },
});

const QuestionListPage = ({tagFilterActive, searchFilterActive}) => {
    const { tagName, query } = useParams();
    const { user } = useAuthContext();
    const [quesData, setQuesData] = useState(null);
    const [sortBy, setSortBy] = useState('HOT');
    const [page, setPage] = useState(1);
    const { notify, clearEdit } = useStateContext();
    const theme = useTheme();
    const classes = useStyles();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // quering the questions
    const [fetchQuestions, {data, loading}] = useLazyQuery(GET_QUESTIONS, {
      fetchPolicy: 'no-cache',
      onError: (err) => {
        notify(getErrorMsg(err), 'error');
      }
    });

    // fetching the questions
    const getQues = (sortBy, page, limit, filterByTag, filterBySearch) => { 
      fetchQuestions({
        variables: { sortBy, page, limit, filterByTag, filterBySearch },
      });
    };

    useEffect(() => {
      getQues(sortBy, 1, 12, tagName, query);
      setPage(1);
      window.scrollTo(0,0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy, tagName, query]);

    useEffect(() => {
      if(data && page === 1){
        setQuesData(data.getQuestions);
      }
      if(data && page !== 1){
        setQuesData((prevState) => ({
          ...data.getQuestions,
          questions: prevState.questions.concat(
            filterDuplicates(prevState.questions, data.getQuestions.questions)
          ),
        }));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[data]);

    const handleLoadPosts = () => {
      getQues(sortBy, page+1, 12, tagName, query);
      setPage(page+1);
    };
     
    return (
      <div style={!isMobile ? classes.root: classes.root.mobileStyle}>
      <div style={!isMobile ? classes.topBar: classes.topBar.mobileStyle}>
        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          color="secondary"
          style={{ wordWrap: 'anywhere' }}
        >
          {tagFilterActive
            ? `Questions tagged [${tagName}]`
            : searchFilterActive
            ? `Search results for "${query}"`
            : 'All Questions'}
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
      <SortQuestionBar isMobile={isMobile} sortBy={sortBy} setSortBy={setSortBy} />
      <Divider />
      {loading && page === 1 && (
        <div style={{ minWidth: '100%', marginTop: '1em' }}>
          <Spinner size={60} />
        </div>
      )}
      { 
        (quesData && quesData.questions.length !== 0 ? (
          quesData.questions.map((q) => <QuestionCard key={q.id} question={q} />)
        ) : (
          <Typography
            color="secondary"
            variant="h6"
            style={classes.noQuesText}
          >
            {tagFilterActive
              ? `There are no questions tagged "${tagName}".`
              : searchFilterActive
              ? `No matches found for your search "${query}".`
              : 'No questions found.'}
          </Typography>
        ))}
      {quesData && quesData.next && (
        <LoadMoreButton
          loading={page !== 1 && loading}
          handleLoadPosts={handleLoadPosts}
        />
      )}
    </div>
    );
}

export default QuestionListPage;