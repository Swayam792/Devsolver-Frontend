import { useTheme } from "@emotion/react";
import { Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useLocation, Link as RouterLink } from 'react-router-dom';
import PublicIcon from '@mui/icons-material/Public';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close'; 
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PeopleIcon from '@mui/icons-material/People';

const useStyles = (theme) => ({
    menuIcon: {
        marginRight: '6px',
        fontSize: '1.3em',
    },
    closeIcon: {
        boxSizing: 'border-box',
        border: `0.5px solid ${theme.palette.primary.main}60`,
        borderRadius: 3,
    }, 
    userBtn: {
        textTransform: 'none',
        display: 'flex',
    }, 
});

const NavMenuMobile = () => {
    const { pathname } = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const classes = useStyles(theme);

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    }

    return (
        <div>
            <IconButton color="primary" onClick={handleOpenMenu}>
                {!anchorEl ? <MenuIcon /> : <CloseIcon style={classes.closeIcon}/>}
            </IconButton>

            <Menu 
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              marginThreshold={0}
              elevation={1}
            >
                <MenuItem
                    selected={
                        pathname === '/' || 
                        (!pathname.startsWith('/tags') && !pathname.startsWith('/user'))
                    }
                    dense
                    component={RouterLink}
                    to="/"
                    onClick={handleCloseMenu}
                >
                    <PublicIcon style={classes.menuIcon}/>
                    DevSolver
                </MenuItem>
                <MenuItem
                    selected={pathname.startsWith('/tag')}
                    dense
                    component={RouterLink}
                    to="/tags"
                    onClick={handleCloseMenu}
                    >
                    <LocalOfferIcon style={classes.menuIcon} />
                    Tags
                </MenuItem>
                <MenuItem
                    selected={pathname.startsWith('/user')}
                    dense
                    component={RouterLink}
                    to="/users"
                    onClick={handleCloseMenu}
                    >
                    <PeopleIcon style={classes.menuIcon} />
                    Users
                </MenuItem>
                <Divider />
            </Menu>
        </div>
    );
}

export default NavMenuMobile;