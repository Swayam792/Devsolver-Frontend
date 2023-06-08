import { useQuery } from "@apollo/client";
import {useTheme} from "@emotion/react";
import {useStateContext} from "../context/stateContext.js";
import {Grid, Typography, Chip, useMediaQuery} from "@mui/material";
import { GET_ALL_TAGS } from "../graphql/queries.js";
import { Link as RouterLink } from "react-router-dom";
import { getErrorMsg } from "../utils/helperFunction.js";
import Spinner from "./Spinner.js";

const useStyles = (theme) => ({
    rootPanel: {
      position: 'sticky',
      display: 'flex',
      minHeight: '10vh',
      top: '5.5vH',
    },
    content: {
      paddingTop: 0,
      marginTop: '1em',
    },
    tagsColumn: {
      border: `1px solid ${theme.palette.primary.main}50`,
      borderRadius: 4,
      padding: '0.8em',
      backgroundColor: `${theme.palette.primary.main}08`,
    },
    tagsWrapper: {
      marginTop: '1em',
      display: 'grid',
      width: '100%',
      gridTemplateColumns: 'repeat(2, minmax(130px, 1fr))',
      gridGap: '8px',
    },
});

const RightSidePanel = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const { notify } = useStateContext();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const {data, loading} = useQuery(GET_ALL_TAGS, {
        onError: (err) => {
            notify(getErrorMsg(err), 'error');
        },
    });

    if(isMobile) return null;

    return (
        <Grid item>
            <div style={classes.rootPanel}>
                <div style={classes.content}>
                    <div style={classes.tagsColumn}>
                        <Typography variant="h6" color="secondary">
                            Top Tags
                        </Typography>
                        {!loading && data ? (
                            <div style={classes.tagsWrapper}>
                                {data.getAllTags.slice(0, 26).map((t) => (
                                <div key={t.tagName}>
                                    <Chip
                                    label={
                                        t.tagName.length > 13
                                        ? t.tagName.slice(0, 13) + '...'
                                        : t.tagName
                                    }
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    component={RouterLink}
                                    to={`/tags/${t.tagName}`}
                                    style={classes.tag}
                                    clickable
                                    />
                                    <Typography
                                    color="secondary"
                                    variant="caption"
                                    >{` × ${t.count}`}</Typography>
                                </div>
                                ))}
                            </div>
                            ) : (
                            <div style={{ minWidth: '200px' }}>
                                <Spinner size={40} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Grid>
    );
};

export default RightSidePanel;