import { Link as RouterLink } from "react-router-dom";
import { formatDateAgo } from "../utils/helperFunction";
import { Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";

const useStyles = () => ({
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

const RecentQuestions = ({ question }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const classes = useStyles(); 

    return (
    <div style={classes.recentQuesAns}>
      <div style={classes.votesTitleWrapper}>
        <div style={!isMobile ? classes.votes: classes.votes.mobileStyle}>
          <Typography color="primary" variant="subtitle2">
            {question.points}
          </Typography>
        </div>
        <Typography
          variant="subtitle2"
          color="secondary"
          style={classes.title}
          component={RouterLink}
          to={`/questions/${question.id}`}
        >
          {question.title}
        </Typography>
      </div>
      <Typography variant="caption" style={classes.timeAgo}>
        {formatDateAgo(question.createdAt)} ago
      </Typography>
    </div>
    );
}

export default RecentQuestions;