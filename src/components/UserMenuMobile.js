import { useState } from "react";
import { useTheme } from "@emotion/react";
import { Avatar, Menu, MenuItem, IconButton } from "@mui/material";
import {Link as RouterLink} from 'react-router-dom'; 
import AuthModel from "./AuthModel";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
 
const useStyles = (theme) => ({
  menuIcon: {
    marginRight: '6px',
    fontSize: '1.3em',
  },   
  userBtn: {
    textTransform: 'none',
    display: 'flex',
  },
  avatar: {    
      marginRight: '0.2em',
      width: theme.spacing(2.8),
      height: theme.spacing(2.8),    
  },
  moreBtn: {
    padding: '0.2em',
  },
  userBtnMob: {
    padding: '0.3em',
  },
});

const UserMenuMobile = ({user, logoutUser}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const classes = useStyles(theme);

    const handleOpenMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleCloseMenu = () => {
      setAnchorEl(null);
    };
  
    const handleLogoutClick = () => {
      logoutUser();
      handleCloseMenu();
    };

    return (
      <div>
      {user ? (
        <IconButton onClick={handleOpenMenu} style={classes.userBtnMob}>
          <Avatar
            alt={user.username}
            src={`https://secure.gravatar.com/avatar/${user.id}?s=164&d=identicon`}
            style={classes.avatar}
          />
          <MoreVertIcon color="primary" />
        </IconButton>
      ) : (
        <IconButton
          onClick={handleOpenMenu}
          color="primary"
          style={classes.moreBtn}
        >
          <MoreVertIcon color="primary" />
        </IconButton>
      )}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        marginThreshold={0}
        elevation={1}
      >
        {user ? (
          <div>
            <MenuItem
              component={RouterLink}
              to={`/user/${user.username}`}
              onClick={handleCloseMenu}
            >
              <AccountCircleIcon style={classes.menuIcon} />
              My Profile
            </MenuItem>
            <MenuItem onClick={handleLogoutClick}>
              <PowerSettingsNewIcon style={classes.menuIcon} />
              Logout: {user.username}
            </MenuItem>
          </div>
        ) : (
          <AuthModel buttonType="mobile" closeMenu={handleCloseMenu} />
        )}
      </Menu>
    </div>
    );
}

export default UserMenuMobile;