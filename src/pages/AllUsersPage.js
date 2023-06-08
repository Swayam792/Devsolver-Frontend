import { useState } from "react";
import { useQuery } from "@apollo/client"; 
import { Link as RouterLink } from "react-router-dom";
import { Typography, TextField, Link, InputAdornment, Avatar, useMediaQuery } from "@mui/material";
import LoadingSpinner from "../components/Spinner.js";
import { useStateContext } from "../context/stateContext"; 
import { GET_ALL_USERS } from "../graphql/queries";
import SearchIcon from "@mui/icons-material/Search";
import { formatDateAgo, getErrorMsg } from "../utils/helperFunction";
import { useTheme } from "@emotion/react";

const useStyles = (theme) => ({
    root: {
        marginTop: '1em',
        padding: '0.4em 0.7em',
        width: '100%',
    },
    filterInput: {
        marginTop: '1.2em',
        mobileStyle: {
          width: '100%',
        },
    },
    usersWrapper: {
        marginTop: '1.4em',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gridGap: '14px',
    },
    userBox: {
        display: 'flex',
        alignItems: 'center',
    },
    avatar: {
        width: theme.spacing(6),
        height: theme.spacing(6),
        marginRight: '0.6em',
        borderRadius: 2,
    },
});

const AllUsersPage = () => {
    const { notify } = useStateContext();     
    const [filterInput, setFilterInput] = useState('');
    const theme = useTheme();
    const classes = useStyles(theme);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { loading, data } = useQuery(GET_ALL_USERS, {
        onError: (err) => {
            notify(getErrorMsg(err), 'error');
        }
    });

     

    return (
        <div style={classes.root}>
            <Typography variant="h5" color="secondary">
                Users
            </Typography>
            <TextField
                style={!isMobile ? classes.filterInput: classes.filterInput.mobileStyle}
                value={filterInput}
                placeholder="Filter by username"
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
                <div style={classes.usersWrapper}>
                    {data.getAllUsers
                        .filter((u) =>
                            u.username.toLowerCase().includes(filterInput.toLowerCase())
                        )
                        .map((u) => (
                            <div key={u.id} style={classes.userBox}>
                                <Avatar
                                    src={`https://secure.gravatar.com/avatar/${u.id}?s=164&d=identicon`}
                                    alt={u.username}
                                    style={classes.avatar}
                                    component={RouterLink}
                                    to={`/user/${u.username}`}
                                />
                                <div>
                                    <Link component={RouterLink} to={`/user/${u.username}`}>
                                        <Typography variant="body2">{u.username}</Typography>
                                    </Link>
                                    <Typography variant="caption">
                                        created {formatDateAgo(u.createdAt)} ago
                                    </Typography>
                                </div>
                            </div>
                        ))}
                </div>
            ) : (
                <div style={{ minWidth: '100%' }}>
                    <LoadingSpinner size={80} />
                </div>
            )}
        </div>
    );
};

export default AllUsersPage;