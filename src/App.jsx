import * as React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import {redirect, parseDate} from './helpers/utils';
import GlobalStore, {GlobalStoreProvider} from './helpers/store';

import { Navbar, Sidebar } from './components/nav';
import { Page } from './components';

import LoadScreen from './pages/LoadScreen';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import PlaceScreen from './pages/store/Layout';

const { sessionStorage } = window;

function App() {
  let app, defaultStore;
  const [alert, setAlert] = React.useState(null)
  const [alertVisibility, setAlertVisibility] = React.useState(false)
  const [globalState, setGlobalState] = React.useState(defaultStore)
  const [authState, setAuthState] = React.useState(false); // not logged in
  const [userProfile, setUserProfile] = React.useState(null); // not logged in


  defaultStore = {
    apiUrl: process.env.API_URL || "http://localhost:8000/api",
    org: process.env.API_ORG,
    userProfile,
    setUserProfile,
    notification: alert,
    globalState: globalState,
    setGlobalState: setGlobalState,
    notify: notify,
    authState,
    flutterwaveApiKey: 'FLWPUBK_TEST-31a9886ef34c36ebf89a1e4a58d3b0ef-X',
    setAuthState,
    getUserData: () => {
      return JSON.parse(sessionStorage.getItem('auth-user'))
    },
    redirect: redirect,
  }

  React.useEffect(() => {
    // reload on login
  }, [])

  function notify (level='info', message, sleep=2500){
    setAlertVisibility(true)
    setAlert({ level, message })
    setTimeout(() => {
      setAlert()
      setAlertVisibility(false)
    }, sleep);
  }

  return (
    <Page sx={{p: '0px !important'}}>
      <GlobalStoreProvider value={defaultStore}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />                
          <Route path="/signup" element={<SignupPage />} />                
          <Route path="/:place/*" element={<PlaceScreen />} />
          <Route path="/" element={<LoadScreen />} />                
        </Routes>
      </Router>

      {/* Notifications bar */}
      <Snackbar
       anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
       open={alertVisibility}
       autoHideDuration={2500}
       sx={{zIndex: '2000 !important'}}
       >
        {
          alert && 
          <Alert className="alert" severity={alert?.level} sx={{ minWidth: 250, maxWidth: 300 }}>
           <Typography component="p"> {alert?.message} </Typography>
         </Alert>
        }
      </Snackbar>
    </GlobalStoreProvider>
    </Page>
  );
}

export default App;

