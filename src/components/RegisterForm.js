import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '../graphql/mutations';
import { useAuthContext } from '../context/authContext';
import { useStateContext } from '../context/stateContext';
import ErrorMessage from './ErrorMessage';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import logo from '../assets/DevSolver-logo.png';
import { getErrorMsg } from '../utils/helperFunction';

import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Link,
  useMediaQuery,
} from '@mui/material'; 
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTheme } from '@emotion/react';

const validationSchema = yup.object({
  username: yup
    .string()
    .required('Required')
    .max(20, 'Must be at most 20 characters')
    .min(3, 'Must be at least 3 characters')
    .matches(
      /^[a-zA-Z0-9-_]*$/,
      'Only alphanum, dash & underscore characters are allowed'
    ),
  password: yup
    .string()
    .required('Required')
    .min(6, 'Must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Required')
    .min(6, 'Must be at least 6 characters'),
});


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
  

const RegisterForm = ({ setAuthType, closeModel }) => {
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showConfPass, setShowConfPass] = useState(false);
  const theme = useTheme();
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 
  const { setUser } = useAuthContext();
  const { notify } = useStateContext();
  const { register, handleSubmit, reset, formState: {errors} } = useForm({
    mode: 'onTouched',
    resolver: yupResolver(validationSchema),
  });

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    onError: (err) => {
      setErrorMsg(getErrorMsg(err));
    },
  });

  const onRegister = ({ username, password, confirmPassword }) => {
    if (password !== confirmPassword)
      return setErrorMsg('Both passwords need to match.');

    registerUser({
      variables: { username, password },
      update: (_, { data }) => {
        setUser(data.register);
        notify(
          `Welcome, ${data.register.username}! You've successfully registered.`
        );
        reset();
        closeModel();
      },
    });
  };

  return (
    <div style={!isMobile ? classes.root: classes.root.mobileStyle}>
      <img src={logo} alt="sof-logo" style={classes.titleLogo} />
      <form onSubmit={handleSubmit(onRegister)}>
        <div style={classes.inputField}>
          <TextField
            required
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
            type={showPass ? 'text' : 'password'}
            label="Password"
            variant="outlined"
            size="small"
            error={errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPass((prevState) => !prevState)}
                    size="small"
                  >
                    {showPass ? (
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
        <div style={classes.inputField}>
          <TextField
            required
            fullWidth
            {...register('confirmPassword')}
            name="confirmPassword"
            type={showConfPass ? 'text' : 'password'}
            label="Confirm Password"
            variant="outlined"
            size="small"
            error={errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfPass((prevState) => !prevState)}
                    size="small"
                  >
                    {showConfPass ? (
                      <VisibilityOffIcon color="secondary" />
                    ) : (
                      <VisibilityIcon color="secondary" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
              startAdornment: (
                <InputAdornment position="start">
                  <EnhancedEncryptionIcon color="primary" />
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
          startIcon={<PersonAddIcon />}
          type="submit"
          disabled={loading}
        >
          Sign Up
        </Button>
      </form>
      <Typography variant="body1" style={classes.footerText}>
        Already have an account?{' '}
        <Link onClick={() => setAuthType('login')} style={classes.link}>
          Log In
        </Link>
      </Typography>
      <ErrorMessage
        errorMsg={errorMsg}
        clearErrorMsg={() => setErrorMsg(null)}
      />
    </div>
  );
};

export default RegisterForm;
