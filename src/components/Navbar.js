import {AppBar, Button, Container, IconButton, Toolbar, useMediaQuery} from "@mui/material"; 
import SearchIcon from '@mui/icons-material/Search';
import logo from "../assets/DevSolver-logo.png";
import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";  
import UserMenuDesktop from "./UserMenuDesktop";
import { useAuthContext } from "../context/authContext";
import { useApolloClient } from "@apollo/client";
import UserMenuMobile from "./UserMenuMobile";
import NavMenuMobile from "./NavMenuMobile.js"; 
import { useNavigate } from "react-router-dom";

const useStyles = () => ({
    appBar: {
        padding: "5px", 
    },
    leftPortion: {
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center'
    },
    logoWrapper: {
        marginRight: '1em',
        mobileStyle : {
          display: 'flex',
          alignItems: 'center',
        },
    },
    logo: {
        textTransform: 'none',
        fontSize: '1.3em',
        padding: '0.1em',
        marginRight: '0.3em'
    },
    contentContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    searchBtn: {
        padding: '0.2em'
    } 
});
 
export const NavBar = () => { 
    const {user, logoutUser} = useAuthContext();
    const client = useApolloClient();
    const [searchOpen, setSearchOpen] = useState(false); 
    const theme = useTheme();
    const navigate = useNavigate();
    const classes = useStyles();    
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  
    useEffect(() => {
        if(!isMobile && searchOpen){
            setSearchOpen(false);
        }
    },[isMobile]); 

    const handleLogout = () => {        
        logoutUser();
        client.resetStore();
    }

    return (
        <AppBar
         position="sticky"
         color="inherit"
         elevation={1}
         style={classes.appBar}     
        > 
            {/* <Toolbar variant="dense"> */}
            { !searchOpen && (
                    <Container disableGutters style={classes.contentContainer}>
                        <div style={classes.leftPortion}>
                            <div style={!isMobile ? classes.logoWrapper: classes.logoWrapper.mobileStyle}>
                                {isMobile && <NavMenuMobile />}
                                {isMobile ? (
                                    <IconButton style={classes.logo}>
                                        <img src={logo} width="25px" alt="DevSolver" />
                                    </IconButton> 
                                ): (
                                    <Button onClick={() => navigate("/")} style={classes.logo} size="large">
                                        <img src={logo} width="30px" alt="DevSolver" 
                                        style={{marginRight: '5px'}} />
                                        <strong>DevSolver</strong>
                                    </Button>
                                )}                                 
                            </div>
                            {!isMobile && <SearchBar />}
                        </div>
                        {isMobile ? (
                            <>
                             <IconButton color="primary"
                             style={classes.searchBtn}
                             onClick={() => setSearchOpen((prev) => !prev)}
                             >
                                <SearchIcon />
                             </IconButton>
                             <UserMenuMobile user={user} logoutUser={handleLogout}/>
                            </>
                        ): (
                            <>
                              <UserMenuDesktop user={user} logoutUser={handleLogout}/>
                            </>
                        )}
                    </Container>
                ) 
                } 
                {searchOpen && isMobile && (
                    <SearchBar isMobile={isMobile} setSearchOpen={setSearchOpen} theme={theme}/> 
                )}
            {/* </Toolbar> */} 
        </AppBar>
      
    );
}


 