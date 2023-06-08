import { useState } from "react";
import { useTheme } from "@emotion/react";
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import logo from "../assets/DevSolver-logo.png";

import { TextField, Button, Typography, InputAdornment, IconButton, Link, useMediaQuery } from "@mui/material";
import { useAuthContext } from "../context/authContext.js";
import { useStateContext } from "../context/stateContext.js";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../graphql/mutations";
import { getErrorMsg } from "../utils/helperFunction";
import ErrorMessage from "./ErrorMessage.js";

import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

const useStyles = () => ({
  root: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    mobileStyle: {
      padding: '0 0 0 0',
    },
  },
  inputField: {
    marginBottom: '1.5em'
  },
  submitButton: {
    marginTop: '1.8em'
  },
  titleLogo: {
    display: 'block',
    width: '5em',
    margin: '0 auto 2em auto'
  },
  footerText: {
    marginTop: '1em',
    textAlign: 'center'
  },
  link: {
    cursor: 'pointer'
  }
});

const validationSchema = yup.object({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required')
})

const LoginForm = ({ setAuthType, closeModel }) => {
  const [showPassword, setshowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const theme = useTheme();
  const classes = useStyles();
  const { setUser } = useAuthContext();
  const { notify } = useStateContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 

  const { register, handleSubmit, reset, formState: {errors}} = useForm({
      mode: "onTouched",
      resolver: yupResolver(validationSchema)
  });

  const [loginUser, {loading}] = useMutation(LOGIN_USER, {
    onError: (err) => {
      setErrorMsg(getErrorMsg(err));
    }
  });

  const onLogin = ({ username, password}) => {
    loginUser({
      variables: { username, password},
      update: (_, { data }) => {
        setUser(data.login);
        notify(`Welcome, ${data.login.username}!`);
        reset();
        closeModel();
      }
    })
  }  
    
  return (
      <div style={!isMobile ? classes.root: classes.root.mobileStyle}>
          <img src={logo} alt="DevSolver"  style={classes.titleLogo}/>
          <form onSubmit={handleSubmit(onLogin)}>
              <div style={classes.inputField}>
                  <TextField
                      fullWidth
                      {...register('username')}
                      name="username"
                      type="text"
                      label="Username"
                      variant="outlined"
                      size="small"
                      error={errors.username}
                      helperText={errors.username?.message}
                      InputProps={{
                      startAdornment: (
                          <InputAdornment position="start">
                          <PersonIcon color="primary" />
                          </InputAdornment>
                      ),
                      }}
                  />
              </div>

              <div style={classes.inputField}>
                  <TextField
                    required
                    fullWidth
                    {...register('password')}
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    variant="outlined"
                    size="small"
                    error={errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setshowPassword((prevState) => !prevState)}
                            size="small"
                          >
                            {showPassword ? (
                              <VisibilityOffIcon color="secondary" />
                            ) : (
                              <VisibilityIcon color="secondary" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
              </div>
              <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                startIcon={<ExitToAppIcon />}
                type="submit"
                disabled={loading}
              >
               Log In
              </Button>
      </form>
        <Typography variant="body1" style={classes.footerText}>
            Don’t have an account?{' '}
            <Link onClick={() => setAuthType('signup')} style={classes.link}>
              Sign Up
            </Link>
        </Typography>
        <ErrorMessage
            errorMsg={errorMsg}
            clearErrorMsg={() => setErrorMsg(null)}
        />
      </div>
  );
}

export default LoginForm;