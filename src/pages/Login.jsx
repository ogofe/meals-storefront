import * as React from 'react';
import {
  Link,
  useSearchParams,
  useNavigate,
} from 'react-router-dom';
import { Navbar, Sidebar } from '../components/nav';
import { StyledButton, Separator, StyledLinkButton } from '../components';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import GlobalStore, {GlobalStoreProvider} from '../helpers/store';

const {sessionStorage, localStorage} = window;

export const LoginPage = ({ }) =>{
  const redirect = useNavigate();
  const {notify, apiUrl, setUserProfile, authState, setAuthState} = React.useContext(GlobalStore);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const params = Object.fromEntries([...searchParams])
  const nextUrl = params?.rdr_next || '/the-ring/'

  function handleReturnCode(e){
    // respond to the return code and
    // callback from google and fb auth;
  }

  function loginWithGoogle(){
    //const OAuthUrl = "";
    const popup = window.open(
      'http://localhost:3000/login/?rdr_next=/google/',
      'popup', 
      `resizable=no,width=600,height=600`
    )
    return false;
  }

  function loginWithFacebook(){
    //const graphUrl = "";
    const popup = window.open(
      'http://localhost:3000/login/?rdr_next=/facebook/',
      'popup', 
      `resizable=no,width=600,height=600`
    )
    return false;
  }


  async function submitCredentials(ev){
    ev.preventDefault();

    try{
      let res, data, payload = JSON.stringify({
        email,
        password
      });

      res = await fetch(`${apiUrl}/login/`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      });

      data = await res.json();

      if (res.ok){

        setUserProfile(data)
        sessionStorage.setItem('auth-user', JSON.stringify(data))
        notify('info', 'Successfully Logged In!')
        return setTimeout(() => (document.location.href = `${nextUrl}`), 1200);
      }

      if (data.error){
        return notify('error', data.message)
      }
      return notify('error', 'Something went wrong!')

    }catch(err){
      notify('error', "Something went wrong")
      console.error(err)
    }
  }

  return(
    <Box className="page" sx={{minHeight: 'unset !important'}}>

      <Box className="card" sx={{width: '95%', maxWidth: 500, mx: 'auto', my: 3}}>
        <Box sx={{py: 2, px: 3}} className="form">
          <Typography component="h1" sx={{my: 1, opacity: .5}} className="form-title"> Welcome Back! </Typography>
          <Typography component="h1" sx={{opacity: .5}} className="">
            Please login to place an order on this website.
          </Typography>
          
          <Typography component="h1" sx={{opacity: .5}} className="">
            Don't have an account? <Link className="hotlink" to={() => {
              if (nextUrl){
                return `/signup/?rdr_next=${nextUrl}`
              }
              return `/signup/`
            }}> Signup Here </Link>
          </Typography>
        </Box>
      </Box>

      <Box className="card" sx={{width: '95%', maxWidth: 500, mx: 'auto'}}>
        <Box sx={{py: 2, px: 3}} className="form">
          <Typography component="h1" sx={{my: 2, opacity: .5}} className="form-title"> Log in to continue </Typography>
          <Box sx={{my: 1.5}} className="form-group">
            <Typography component="p"> Email </Typography>
            <input required className="input" onInput={e => setEmail(e.target.value)} name="email" type="email" />
          </Box>
          
          <Box sx={{my: 1.5}} className="form-group">
            <Typography component="p"> Password </Typography>
            <input required className="input" onInput={e => setPassword(e.target.value)} name="password" type="password" />
          </Box>

          <StyledButton onClick={submitCredentials} sx={{width: '100%', my: 1}}>
            <Typography sx={{
              fontWeight: 600,
              ml: 1,
            }}> Login with Email </Typography>
          </StyledButton>
        </Box>
      </Box>

      <Box className="" sx={{width: '95%', maxWidth: 500, mx: 'auto'}}>
        <Separator /> 

        <StyledLinkButton icon={<GoogleIcon />} onClick={loginWithGoogle} variant="danger" sx={{width: '100%', my: 1}}>
          <Typography sx={{
            fontWeight: 600,
            ml: 1,
          }}> Login with Google </Typography>
        </StyledLinkButton>

        <StyledLinkButton icon={<FacebookIcon />} onClick={loginWithFacebook} variant="primary" sx={{width: '100%', my: 1}}>
          <Typography sx={{
            fontWeight: 600,
            ml: 1,
          }}> Login with Facebook </Typography>
        </StyledLinkButton>

      </Box>
      
    </Box>
  )
}


export default LoginPage;