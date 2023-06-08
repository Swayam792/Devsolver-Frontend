import { Button, Dialog, DialogContent, DialogTitle, IconButton, SvgIcon, Link, MenuItem } from "@mui/material";
import { useState } from "react";
import {useMediaQuery} from "@mui/material";
import {ReactComponent as UpvoteIcon} from "../assets/upvote.svg";
import {ReactComponent as DownvoteIcon} from "../assets/downvote.svg";

import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import  {useTheme} from "@emotion/react";
import LoginForm from "./LoginForm.js";
import RegisterForm from "./RegisterForm.js";

const useStyles = (theme) => ({   
    link: {
        cursor: 'pointer'
    },
    dialogWrapper: {
        padding: 0,
        overflow: 'hidden',
        mobileStyle: {
            padding: 0
        },
    },
    menuIcon: {
        marginRight: '6px',
        fontSize: '1.3em'
    },
    upDownIcon: {
        color: '#aa9aaa',
        fontSize: 32
    }
});


const AuthModel = ({ closeMenu, buttonType }) => {
    const [modelOpen, setModelOpen] = useState(false);
    const [authType, setAuthType] = useState('login');

    const theme = useTheme();
    const classes = useStyles(theme);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleLoginModel = () => {
        setAuthType('login');
        setModelOpen(true);
        if(buttonType === 'mobile'){
            closeMenu();
        }
    }

    const handleSignupModel = () => {
        setAuthType('signup');
        setModelOpen(true);
        if (buttonType === 'mobile') {
          closeMenu();
        }
    }
    
    const handleModelClose = () => {
        setModelOpen(false);
    };

    const triggerButton = () => {
        if(buttonType === 'ask'){
            return (
                <Button variant="contained"
                 color="primary"
                 size={isMobile ? 'small' : 'medium'}
                 style={{minWidth: '9em'}}
                 onClick={handleLoginModel}
                >
                    Ask Question
                </Button>
            )
        }else if(buttonType === 'link'){
            return (
                <Link onClick={handleLoginModel} style={{ cursor: 'pointer' }}>
                  ask your own question.
                </Link>
            );
        }else if(buttonType === 'upvote'){
            return (
                <IconButton onClick={handleLoginModel}>
                  <SvgIcon style={classes.upDownIcon}>
                    <UpvoteIcon />
                  </SvgIcon>
                </IconButton>
              );
        }else if(buttonType === 'downvote'){
            return (
                <IconButton onClick={handleLoginModel}>
                <SvgIcon style={classes.upDownIcon}>
                  <DownvoteIcon />
                </SvgIcon>
              </IconButton>
            );
        }else if(buttonType === 'mobile'){
            return (
                <> 
                    <MenuItem onClick={handleLoginModel}>
                        <ExitToAppIcon style={classes.menuIcon} />
                        Log In
                    </MenuItem>
                    <MenuItem onClick={handleSignupModel}>
                        <PersonAddIcon style={classes.menuIcon} />
                        Sign Up
                    </MenuItem>
                </>
            );
        }else{
            return (
                <div>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  style={{ marginRight: 7 }}
                  onClick={handleLoginModel}
                >
                  Log In
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={handleSignupModel}
                >
                  Sign Up
                </Button>
              </div>
            );
        }
    }
    

    return (
        <div style={{display: 'inline'}}>
            {triggerButton()}
            <Dialog 
            open={modelOpen}
            onClose={handleModelClose}
            maxWidth="sm"
            classes={{ paper: !isMobile ? classes.dialogWrapper: classes.dialogWrapper.mobileStyle }}
            >  
                <DialogTitle onClose={handleModelClose}></DialogTitle>
                <DialogContent>
                    {authType === 'login' ? (
                        <LoginForm 
                        setAuthType={setAuthType}
                        closeModel={handleModelClose}
                        />
                    ): (
                        <RegisterForm 
                            setAuthType={setAuthType}
                            closeModel={handleModelClose}
                        />
                    )}
                </DialogContent>
        </Dialog>
        </div>
    );
}

export default AuthModel;