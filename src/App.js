import './App.css';
import { NavBar } from './components/Navbar.js';
import { ThemeProvider } from '@emotion/react';
import customTheme from './theme/customTheme';
import { Paper } from '@mui/material';
import AllRoutes from './routes/AllRoutesPage';
import ToastNotification from "./components/ToastNotification.js";

const useStyles = () => ({
  root: {
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: '100vh',
  },
});

function App() {
  const classes = useStyles();
  return (
    <ThemeProvider theme={customTheme}>
      <Paper style={classes.root} elevation={0}>
        <ToastNotification />
        <NavBar/>
        <AllRoutes />
      </Paper>
    </ThemeProvider> 
  );
}

export default App;
