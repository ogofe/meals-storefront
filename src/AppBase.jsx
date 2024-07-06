import * as React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
// import axios from 'axios';
import { useMediaQuery } from '@mui/material';
import {redirect} from './helpers/utils';
import {GlobalStoreProvider} from './helpers/store';
import { Page, ErrorBoundary } from './components';

import LoadScreen from './pages/LoadScreen';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import IPData from 'ipdata';

const { localStorage } = window;

function AppBase() {
  let app, defaultStore;
  const [alert, setAlert] = React.useState(null)
  const [alertVisibility, setAlertVisibility] = React.useState(false)
  const [globalState, setGlobalState] = React.useState(defaultStore)
  const [authState, setAuthState] = React.useState(false); // not logged in
  const [userProfile, setUserProfile] = React.useState(null); // not logged in
  const [appManifest, setAppManifest] = React.useState(null); // for pwa install
  const userData = getUserData()
  const isMobilePhone = useMediaQuery('(max-width: 760px)')
  const ipResolver = new IPData("e330adff0252d39787d73caec73d1ceef58b4a84fc239ef3353dc55a")

  // ipResolver.lookup().then(res => {
  //   res.country_name,
  //   res.ip,
  //   res.country_code,
  // })

  console.log("Store:", window.location.hostname.split('.')[0])

  defaultStore = {
    apiUrl:  `https://shagomeals.pythonanywhere.com/api/places`,
    // apiUrl: `http://192.168.43.21:80/api/places`,
    org: process.env.API_ORG,
    userProfile,
    setUserProfile,
    notification: alert,
    globalState,
    setGlobalState,
    notify,
    authState,
    flutterwaveApiKey: 'FLWPUBK_TEST-31a9886ef34c36ebf89a1e4a58d3b0ef-X',
    setAppManifest,
    setAuthState,
    updateManifest,
    ipResolver,
    getUserData: () => {
      return JSON.parse(localStorage.getItem('auth-user'))
    },
    redirect: redirect,
    logoutUser: () => {
      localStorage.removeItem('auth-user');
      setAuthState(false)
      redirect('/login')
    }
  }

  function updateManifest(_manifest){
    setAppManifest(_manifest); 
  }

	function getUserData(){
		let data = localStorage.getItem('auth-user');
		data = JSON.parse(data)
		return data
	}

  function notify (level='info', message, sleep=2500){
    setAlertVisibility(true)
    setAlert({ level, message })
    setTimeout(() => {
      setAlert()
      setAlertVisibility(false)
    }, sleep);
  }
  const navbar = document.querySelector('.navbar')

  window.onscroll = (event) => {
    const pos = window.pageYOffset;

    if(pos > 50){
      navbar.classList.add('scrolled')
    }else{
      navbar.classList.remove('scrolled')
    }
  }

  return (
    // <ErrorBoundary>
      {/* <Helmet> */}
        {/* <meta name="description" content={"Shago meals Application"} /> */}
        {/* <link rel="manifest" href={URL.createObjectURL(new Blob([JSON.stringify(appManifest)], { type: 'application/json' }))} /> */}
      <Page sx={{p: '0px !important'}}>
          <GlobalStoreProvider value={defaultStore}>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />                
              <Route path="/signup" element={<SignupPage />} />                
              <Route path="/*" element={<LoadScreen />} />                
            </Routes>
          </Router>

          {/* Notifications bar */}
          <Snackbar
          anchorOrigin={{vertical: 'bottom', horizontal: isMobilePhone ? 'center' : 'right',}}
          open={alertVisibility}
          autoHideDuration={2500}
          sx={{zIndex: '2000 !important', bottom: '50px'}}
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
      {/* </Helmet> */}
    // </ErrorBoundary>
  );
}

export default AppBase;

