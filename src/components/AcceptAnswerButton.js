import {ReactComponent as AcceptedIcon} from "../assets/accepted.svg";
import { Checkbox, SvgIcon } from "@mui/material";

const useStyles = () => ({
    acceptIcon: {
        color: '#aa9aaa',
        fontSize: 32,
    },
    checkedAcceptIcon: {
        color: '#2e8b57',
        fontSize: 32,
    },
});

const AcceptAnswerButton = ({ checked, handleAcceptAns }) => {
    const classes = useStyles();

    return (
        <Checkbox
            checked={checked}
            icon={
            <SvgIcon style={classes.acceptIcon}>
                <AcceptedIcon />
            </SvgIcon>
            }
            checkedIcon={
            <SvgIcon style={classes.checkedAcceptIcon}>
                <AcceptedIcon />
            </SvgIcon>
            }
            onChange={handleAcceptAns}
       />
    );
};

export default AcceptAnswerButton;