import * as React from 'react';
import {
  Link,
  useNavigate,
  useSearchParams
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
// pages import 
import GlobalStore, {GlobalStoreProvider} from '../helpers/store';


export const LoginPage = ({ }) =>{
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries([...searchParams])
  const nextUrl = params?.rdr_next || '/the-ring/'
  const redirect = useNavigate();
  const {notify} = React.useContext(GlobalStore);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function handleReturnCode(e){
    // respond to the return code and
    // callback from google and fb auth;
  }

  function loginWithGoogle(){
    //const OAuthUrl = "";
  }

  function loginWithFacebook(){
    //const graphUrl = "";
  }


  function submitCredentials(ev){
    ev.preventDefault();
    const popup = window.open(
      'http://localhost:3000/the-ring/',
      'popup', 
      `resizable=no,width=600,height=600`
    )
    return false;
    
    // notify('info', 'Logged In!')
    // redirect('/store/');
  }

  return(
    <Box className="page" sx={{minHeight: 'unset !important'}}>

      <Box className="card" sx={{width: '95%', maxWidth: 500, mx: 'auto', my: 3}}>
        <Box sx={{py: 2, px: 3}} className="form">
          <Typography component="h1" sx={{my: 1, opacity: .5}} className="form-title"> Hello There! </Typography>
          <Typography component="h1" sx={{opacity: .5}} className="">
            Please sign up to place an order on this website.
          </Typography>
          
          <Typography component="h1" sx={{opacity: .5}} className="">
            Already have an account? <Link className="hotlink" to={() => {
              if (nextUrl){
                return `/login/?rdr_next=${nextUrl}`
              }
              return `/login/`
            }}> Login Here </Link>
          </Typography>
        </Box>
      </Box>

      <Box className="card" sx={{width: '95%', maxWidth: 500, mx: 'auto'}}>
        <Box sx={{py: 2, px: 3}} className="form">
          <Typography component="h1" sx={{my: 2, opacity: .5}} className="form-title"> Sign up </Typography>
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
            }}> Sign up with Email </Typography>
          </StyledButton>
        </Box>
      </Box>

      <Box className="" sx={{width: '95%', maxWidth: 500, mx: 'auto'}}>
        <Separator /> 

        <StyledLinkButton icon={<GoogleIcon />} onClick={submitCredentials} variant="danger" sx={{width: '100%', my: 1}}>
          <Typography sx={{
            fontWeight: 600,
            ml: 1,
          }}> Sign up with Google </Typography>
        </StyledLinkButton>

        <StyledLinkButton icon={<FacebookIcon />} onClick={submitCredentials} variant="primary" sx={{width: '100%', my: 1}}>
          <Typography sx={{
            fontWeight: 600,
            ml: 1,
          }}> Sign up with Facebook </Typography>
        </StyledLinkButton>

      </Box>
      
    </Box>
  )
}


export default LoginPage;