import { Link as RouterLink } from "react-router-dom";
import { Paper, Typography, Chip, useMediaQuery } from "@mui/material";
import PostedByUser from "./PostedByUser";
import { useTheme } from "@emotion/react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.bubble.css'

const useStyles = () => ({
    root: {
        borderBottom: '1px solid #dfdfdf',
        display: 'flex',
        padding: '0.5em 0',
        borderRadius: 0,
    },
    infoWrapper: {
        width: '10%',
        padding: '0.4em',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        mobileStyle: {
            width: '22%',
            paddingRight: '0.2em',
        },
    },
    mainText: {
        fontSize: '1.2em',
        fontWeight: 500,
    },
    title: {
        fontSize: '1.2em',
        fontWeight: 500,
        wordWrap: 'anywhere',
        textDecoration: 'none',
        '&:hover': {
            filter: 'brightness(200%)',
        },
        transition: 'all 0.4s ease',
    },
    innerInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    quesDetails: {
        paddingLeft: '0.2em',
        paddingBottom: '0.7em',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
    },
    tagsWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    tag: {
        marginRight: '0.5em',
        marginTop: '0.5em',
    },
    bottomWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    }
});

const QuestionCard = ({ question }) => {
    const theme = useTheme();
    const classes = useStyles();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { id, title, author, body, tags, points, views, answerCount, createdAt} = question;

    return (
        <Paper elevation={0} style={classes.root}>
            <div style={!isMobile ? classes.infoWrapper: classes.infoWrapper.mobileStyle}>
                <div style={classes.innerInfo}>
                <Typography variant="body2" style={classes.mainText}>
                    {points}
                </Typography>
                <Typography variant="caption">votes</Typography>
                </div>
                <div style={classes.innerInfo}>
                <Typography variant="body2" style={classes.mainText}>
                    {answerCount}
                </Typography>
                <Typography variant="caption">answers</Typography>
                </div>
                <Typography variant="caption" noWrap>
                {views} views
                </Typography>
            </div>
            <div style={classes.quesDetails}>
                <Typography
                variant="body2"
                color="secondary"
                style={classes.title}
                component={RouterLink}
                to={`/questions/${id}`}
                >
                {title}
                </Typography>
                {/* <Typography variant="body2" style={{ wordWrap: 'anywhere' }}>
                {body.length > 150 ? body.slice(0, 150) + '...' : body}
                </Typography> */}
                <ReactQuill value={body.length > 150 ? body.slice(0, 150) + '...' : body} readOnly={true} theme={"bubble"}/>
                <div style={classes.bottomWrapper}>
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
                <PostedByUser
                    username={author.username}
                    userId={author.id}
                    createdAt={createdAt}
                />
                </div>
            </div>
        </Paper>
    );
}

export default QuestionCard;