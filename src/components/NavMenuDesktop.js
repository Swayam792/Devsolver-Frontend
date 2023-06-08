import { useTheme } from "@emotion/react";
import { MenuItem, useMediaQuery, Grid, Divider } from "@mui/material";
import { useLocation, Link as RouterLink } from "react-router-dom";
import PublicIcon from '@mui/icons-material/Public';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PeopleIcon from '@mui/icons-material/People'; 
import MessageIcon from '@mui/icons-material/Message';

const useStyles = () => ({
    menuIcon: {
        marginRight: '6px',
        fontSize: '1.3em'
    },    
    rootPanel: {
        position: 'sticky',
        top: '5.5vH',
        display: 'flex',
        minHeight: '94.5vh'
    },
    list: {
     marginTop: '1em',
    },    
    userBtn: {
        textTransform: 'none',
        display: 'flex',
    }, 
    
});

const NavMenuDesktop = () => {
    const { pathname } = useLocation();
    const theme = useTheme();
    const classes = useStyles();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if(isMobile) return null;

    return(
    <Grid item>
      <div style={classes.rootPanel}>
        <div style={classes.list}>
          <MenuItem
            selected={
              pathname === '/' ||
              (!pathname.startsWith('/tag') && !pathname.startsWith('/user'))
            }
            component={RouterLink}
            to="/"
          >
            <PublicIcon style={classes.menuIcon} color="primary" />
            DevSolver
          </MenuItem>
          <MenuItem
            selected={pathname.startsWith('/tag')}
            component={RouterLink}
            to="/tags"
          >
            <LocalOfferIcon style={classes.menuIcon} color="primary"/>
            Tags
          </MenuItem>
          <MenuItem
            selected={pathname.startsWith('/user')}
            component={RouterLink}
            to="/users"
          >
            <PeopleIcon style={classes.menuIcon} color="primary" />
            Users
          </MenuItem>
          <MenuItem
            selected={pathname.startsWith('/messages')}
            component={RouterLink}
            to="/messages"
          >
            <MessageIcon style={classes.menuIcon} color="primary" /> 
            Messages
          </MenuItem>
        </div>
        <Divider orientation="vertical" flexItem />
      </div>
    </Grid>
    );
}

export default NavMenuDesktop;