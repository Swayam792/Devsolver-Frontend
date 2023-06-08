import { useState } from "react";
import { useTheme } from "@emotion/react";
import { Avatar, Button, Menu, MenuItem, Typography, useMediaQuery } from "@mui/material";
import {Link as RouterLink, useLocation} from 'react-router-dom';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AuthModel from "./AuthModel";

const useStyles = (theme) => ({
    menuIcon: {
        marginRight: '6px',
        fontSize: '1.3em'
    },
    
    userBtn: {
        textTransForm: 'none',
        display: 'flex'
    },
    avatar: {
        width: theme.spacing(3.5),
        height: theme.spacing(3.5),
        marginRight: '0.4em',
        borderRadius: 2        
    }    
});

const UserMenuDesktop = ({user, logoutUser}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const location = useLocation();
    const theme = useTheme();
    const classes = useStyles(theme); 

    const handleLogoutClick = () => {
        handleCloseMenu();
        logoutUser();
    }

    const handleOpenMenu = (e) => { 
        setAnchorEl(e.currentTarget);
    }

    const handleCloseMenu = () => {
        setAnchorEl(null);
    }
    return (
        <div>
          {
            user ? (
                <div style={{ display: 'inline'}}> 
                    <Button style={classes.userBtn}
                      onClick={handleOpenMenu}
                      endIcon={<KeyboardArrowDownIcon/>}
                    >
                     <Avatar style={classes.avatar} alt={user.username} src={`https://secure.gravatar.com/avatar/${user.id}?s=164&d=identicon`} />
                     <Typography style={{marginLeft: '8px'}}>
                        {user.username}
                     </Typography>
                    </Button>

                    <Menu
                      anchorEl={anchorEl} 
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleCloseMenu}
                      elevation={1}
                    >
                        <MenuItem
                            component={RouterLink}
                            to={`/user/${user.username}`}
                            onClick={handleCloseMenu}
                            >
                            <AccountCircleIcon style={classes.menuIcon} />
                            My Profile
                        </MenuItem>
                        { !location.pathname.includes("/messages") && <MenuItem onClick={handleLogoutClick}>
                            <LogoutIcon style={classes.menuIcon} />
                            Logout
                        </MenuItem>
                        }
                    </Menu>
                </div>
            ) : (
                <AuthModel />
            )        
          }
        </div>
    );
}

export default UserMenuDesktop;