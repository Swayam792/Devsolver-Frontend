import { Link as RouterLink } from 'react-router-dom';
import { formatDateAgo, formatDayTime} from "../utils/helperFunction.js";
import { Avatar, Typography, Link } from '@mui/material';
import { useTheme } from '@emotion/react';

const useStyles = (theme) => ({       
      byUserWrapper: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '0.7em',
      },
      filledByUser: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '0.7em',
        backgroundColor: `${theme.palette.primary.main}10`,
        padding: '0.4em',
        borderRadius: 3,
        border: `1px solid ${theme.palette.primary.main}40`,
      },
      homeAvatar: {
        width: theme.spacing(4),
        height: theme.spacing(4),
        marginRight: '0.4em',
        borderRadius: 2,
      },
      quesAnsAvatar: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        marginRight: '0.4em',
        borderRadius: 2,
      },
});

const PostedByUser = ({ username, userId, createdAt, updatedAt, filledVariant, isAnswer}) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <div
          style={filledVariant ? classes.filledByUser : classes.byUserWrapper}
        >
        <Avatar
          src={`https://secure.gravatar.com/avatar/${userId}?s=164&d=identicon`}
          alt={username}
          style={filledVariant ? classes.quesAnsAvatar : classes.homeAvatar}
          component={RouterLink}
          to={`/user/${username}`}
        />
        <div>
          <Typography variant="caption" color="secondary">
            {filledVariant
              ? `${isAnswer ? 'answered' : 'asked'} ${formatDayTime(createdAt)}`
              : `asked ${formatDateAgo(createdAt)} ago`}
          </Typography>
          <br />
          {filledVariant && createdAt !== updatedAt && (
            <Typography variant="caption" color="secondary">
              {`updated ${formatDayTime(updatedAt)}`}
            </Typography>
          )}
          <Link component={RouterLink} to={`/user/${username}`}>
            <Typography variant="body2">{username}</Typography>
          </Link>
        </div>
      </div>
    );
};

export default PostedByUser;