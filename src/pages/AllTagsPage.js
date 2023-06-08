import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useStateContext } from "../context/stateContext";
import { GET_ALL_TAGS } from "../graphql/queries";
import { getErrorMsg } from "../utils/helperFunction";
import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import {Typography, TextField, InputAdornment, Chip} from "@mui/material";
import Spinner from "../components/Spinner";
import SearchIcon from "@mui/icons-material/Search";

const useStyles = () => ({
    root: {
        marginTop: '1em',
        padding: '0.4em 0.7em',
        width: '100%',
    },
    titleText: {
        marginBottom: '0.9em',
    },
    filterInput: {
        marginTop: '1.2em',
        mobileStyle: {
          width: '100%',
        },
    },
    tagsWrapper: {
        marginTop: '1em',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(157px, 1fr))',
        gridGap: '12px',
    },
    tagBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '0.8em',
        paddingBottom: '0.4em',
        border: '1px solid #d3d3d3',
        borderRadius: 4,
    },
    tag: {
        marginBottom: '0.9em',
    },
});

const AllTagsPage = () => {
    const { notify } = useStateContext();
    const classes = useStyles();
    const [filterInput, setFilterInput] = useState('');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { data, loading } = useQuery(GET_ALL_TAGS, {
        onError: (err) => {
            notify(getErrorMsg(err), 'error');
        }
    });

    return (
    <div style={classes.root}>
      <Typography variant="h5" style={classes.titleText} color="secondary">
        Tags
      </Typography>
      <Typography variant="body1">
        A tag is a keyword or label that categorizes your question with other,
        similar questions. Using <br />
        the right tags makes it easier for others to find and answer your
        question.
      </Typography>
      <TextField
        style={!isMobile ? classes.filterInput: classes.filterInput.mobileStyle}
        value={filterInput}
        placeholder="Filter by tag name"
        onChange={(e) => setFilterInput(e.target.value)}
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />
      {!loading && data ? (
        <div style={classes.tagsWrapper}>
          {data.getAllTags
            .filter((t) =>
              t.tagName.toLowerCase().includes(filterInput.toLowerCase())
            )
            .map((t) => (
              <div key={t.tagName} style={classes.tagBox}>
                <Chip
                  label={t.tagName}
                  variant="outlined"
                  color="primary"
                  size="small"
                  component={RouterLink}
                  to={`/tags/${t.tagName}`}
                  style={classes.tag}
                  clickable
                />
                <Typography variant="caption" color="secondary">
                  {t.count} questions
                </Typography>
              </div>
            ))}
        </div>
      ) : (
        <div style={{ minWidth: '100%' }}>
          <Spinner size={80} />
        </div>
      )}
    </div>
    );
};

export default AllTagsPage;