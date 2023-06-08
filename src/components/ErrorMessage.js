import { useTheme } from "@emotion/react";
import { Alert, AlertTitle } from "@mui/material"; 

const useStyles = (theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
        marginTop: '0.8em',
        marginBottom: '0.8em'
    }
});

const ErrorMessage = ({ errorMsg, clearErrorMsg}) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    if(!errorMsg){
        return null;
    }

    return (
        <div style={classes.root}>
            <Alert severity="error" onClose={clearErrorMsg}>
                <AlertTitle>Error</AlertTitle>
                {errorMsg}
            </Alert>
        </div>
    );

}

export default ErrorMessage;