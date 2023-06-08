import {ReactComponent as UpvoteIcon} from "../assets/upvote.svg";
import {ReactComponent as  DownvoteIcon} from "../assets/downvote.svg";
import { Checkbox, SvgIcon } from "@mui/material";

const useStyles = () => ({
    icon: {
        color: '#aa9aaa',
        fontSize: 32,
    },
    checkedIcon: {
        color: '#964ec2',
        fontSize: 32,
    },
});

export const UpvoteButton = ({ checked, handleUpvote }) => {
    const classes = useStyles();

    return (
        <Checkbox 
           checked={checked}
           icon={
            <SvgIcon style={classes.icon}>
                <UpvoteIcon />
            </SvgIcon>
           }
           checkedIcon={
            <SvgIcon style={classes.checkedIcon}>
                <UpvoteIcon />
            </SvgIcon>
           }
           onChange={handleUpvote}
        /> 
    );
};

export const DownvoteButton = ({ checked, handleDownvote }) => {
    const classes = useStyles();
    return (
        <Checkbox 
            checked={checked}
            icon={
                <SvgIcon style={classes.icon}>
                    <DownvoteIcon />
                </SvgIcon>
            } 
            checkedIcon={
                <SvgIcon style={classes.checkedIcon}>
                    <DownvoteIcon />
                </SvgIcon>
            }
            onChange={handleDownvote}
        />
    );
};