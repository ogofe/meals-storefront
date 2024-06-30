import React, {useEffect, useState, useContext, useRef, Fragment} from 'react';
import {
  Routes,
  Route,
  useParams
} from 'react-router-dom';
import Cancel from '@mui/icons-material/Cancel'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import {redirect, parseDate} from '../../helpers/utils';
import { Navbar, PageFooter, LocationBar, Sidebar} from '../../components/nav';
import { Page, StyledButton,  } from '../../components';
import GlobalStore, {RestaurantProvider} from '../../helpers/store';
import axios from 'axios';

import StoreHomePage from './Home';
import StoreMenuPage from './Menu';
import MenuItemPage from './ItemDetail';
import BuyerCartPage, { CartPage } from './Cart';
import CheckoutPage from './Checkout';
import CheckoutCompletePage from './CheckoutComplete';
import SettingsPage from '../account/Settings';
import NotificationsPage from './Notifications';
import OrderListPage from '../account/Orders';
import OrderDetailPage from '../account/OrderDetail';
import { useSubdomain } from '../../helpers/hooks';
import { Close } from '@mui/icons-material';
import { ClickAwayListener } from '@mui/material';


function AppLayout({ ...params }) {
  let app, placeStore;
  const [placeState, setPlaceState] = useState(placeStore)
  const [loading, setLoadingState] = useState(true)
  const [showLocator, setLocatorState] = useState(false)
  const [showNav, setNavState] = useState(false)
  const [cartVisibility, setCartVisibility] = useState(false)
  const [restaurant, setRestaurant] = useState(null)
  const [showInstaller, setShowInstaller] = useState(false)
  const {notify, apiUrl, getUserData, ipResolver} = useContext(GlobalStore);
  const [deferredPrompt, setDeferredPrompt] = React.useState(null); // for pwa install
  const [notificationAccess, setNotificationAccess] = React.useState(false); // for pwa install
  // const {place, branch} = useParams();
  // const place = useSubdomain()
  const place = "the-ring"

  const {token} = getUserData();
  const locationBarRef = useRef()

  const axiosClient = axios.create({
    baseURL: `${apiUrl}/`,
    params: {
      place: place,
      // branch: branch,
    },
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    }
  })

  function hideInstaller(){
    setShowInstaller(false)
  }

  function installPWA(){
    try {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the install prompt");
          } else {
            console.log("User dismissed the install prompt");
          }
          setDeferredPrompt(null);
        });
      }
    } catch (error) {
      console.log("Error Installing PWA...", error)      
    }
    
  };

  function requestNotificationPerm(){
    const {Notification} = window;

    const _pushNotifications = Notification.permission
    if(_pushNotifications === "granted"){
      console.log("Notification Permission Granted")
    }else{
      Notification.requestPermission()
      .then(allowNotify => {
        if (allowNotify === 'granted'){
            new Notification("Shago Meals", {
              body: 'Thanks for allowing notifications'
            })
            setNotificationAccess(true)
        }else{
          notify('error', "Please allow notifications to use this site", 3500)
          setNotificationAccess(false)
        }
      })
      .catch(reason => {
        setNotificationAccess(false)
        console.log("Access Denied:", reason)
        notify('error', "Please allow notifications to use this site", 120000)
      })
    }
  }

  function getIPLocation() {
    let _location;
    ipResolver.lookup().then(
      res => {
        console.log("IP RESPONSE:", res);
        _location = res;
      }
    )

    return _location
  }

  function stopInstallPrompt(){
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowInstaller(true)
    });
  }

  function nativeNotify(title="Notification", body){
    function _notify(){
      new Notification(title, {
        body: body,
        // icon: 
        vibrate: true,
        tag: 'important',
        actions: [
          {
            action: `${document.location.hostname}/${place}/cart`,
            title: "View Cart"
          }
        ]
      })
    }

    try{
      _notify()
    }catch(err){
      requestNotificationPerm()
      _notify()
    }
  }

  function showCart(){
    setCartVisibility(true)
  }
  
  function hideCart(){
    setCartVisibility(false)
  }

  function openSidebar(){
    setNavState(true)
  }

  function closeSidebar(){
    setNavState(false)
  }

  function clipboardCopy(text){
    window.navigator.clipboard.writeText(text)
    notify('info', "Copied")
  }

  async function getRestaurant(){
    try{
      let res, data;

      res = await fetch(`${apiUrl}/place/?place=${place}`)
      data = await res.json()
      setRestaurant(data)
    }catch(err){
      console.error("Error getting place:", err)
    }
  }

  function closeLocator(){
    document.querySelector('#location-bar').classList.replace('show', 'hidden')
    setLocatorState(false)
  }

  function showLocatorForm(){
    document.querySelector('#location-bar').classList.replace('hidden', 'show')
    setLocatorState(true)
  }

  async function requestLocationPermission() {
    function onSuccess({code, message}){
        if (code === 0){
            console.log("Permission Granted:", message)
        }
    }

    function onError({code, message}){
        if (code === 1){
            console.log("Permission Denied:", message)
        }
        if (code === 2){
            console.log("Permission Denied:", message)
        }
        if (code === 3){
            console.log("Not Online:", message)
        }
    }

    try{
        navigator.geolocation.watchPosition(onSuccess, onError, {
            enableHighAccuracy: true,
            maximumAge: 2000,
            timeout: 1500
        })
    }catch(err){
        console.log("error",err)
    }
    // navigator.permissions.query('geo')

    // navigator.geolocation.getCurrentPosition(console.log, console.log, {
    //     enableHighAccuracy: true,
    //     maximumAge: 2000,
    //     timeout: 1500
    // })
  }


  placeStore = {
    // state variables
    placeState,
    setPlaceState,
    place,
    restaurant,
    notificationAccess,
    axios: axiosClient,
    app,
    
    // methods
    nativeNotify,
    setNotificationAccess,
    parseDate,
    openSidebar,
    closeSidebar,
    clipboardCopy,
    requestNotificationPerm,
    toggleLocator: () => setLocatorState(!showLocator),
    requestLocationPermission,
    getIPLocation,
    showLocatorForm,
    closeLocator,
    redirect,
  }

  useEffect(() => {
    // get restaurant info
    getRestaurant()
    // Todo: load color scheme from restaurant site settings

    setTimeout(() => setLoadingState(false), 2000)
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    // request Notification Permission
    requestNotificationPerm();

    // Install PWA Prompt
    stopInstallPrompt();

    // eslint-disable-next-line
  }, [notificationAccess, deferredPrompt])

  if (loading){
    return null
  }

  return (
    <Page sx={{p: '0px !important'}} className="layout">
      <RestaurantProvider value={placeStore}>
      <Navbar openSidebar={openSidebar} showCart={showCart} />
      {
        showNav &&
        <Sidebar showNav={showNav} onClose={closeSidebar} />
      }

      <Routes>
        <Route path="/me/settings" element={<SettingsPage place={place} />} />
        <Route path="/me/orders/:orderId" element={<OrderDetailPage place={place} />} />
        <Route path="/me/orders" element={<OrderListPage place={place} />} />
        <Route path="/notifications" element={<NotificationsPage place={place} />} />
        <Route path="/cart/checkout/next" element={<CheckoutCompletePage place={place} />} />
        <Route path="/cart/checkout" element={<CheckoutPage place={place} />} />
        <Route path="/menu/:itemId/" element={<MenuItemPage place={place} />} />
        <Route path="/menu/" element={<StoreMenuPage place={place} />} />
        <Route path="/cart" element={<BuyerCartPage place={place} />} />
        <Route path="/" element={<StoreHomePage place={place} />} />
      </Routes>

      <Box 
        sx={{
          position: 'fixed',
          right: '0px',
          top: '0px',
          width: '100%',
          maxWidth: '400px',
          background: '#fff',
          zIndex: 3000,
          transition: '.5s',
          transform: cartVisibility ? 'translateX(0px)' : 'translateX(450px)',
          py: 3,
          boxShadow: '-1px -1px 15px 0px #04040463'
        }}
        >
        {
          cartVisibility &&
          <Fragment>
            <IconButton onClick={hideCart} sx={{ position: 'absolute', left: '5px', top: '5px'}}><Close /></IconButton>
            <CartPage />
          </Fragment>
        }
      </Box>

      {
        showInstaller &&
        <Box className='install-banner'>
          <Grid className='banner' container flexWrap={"nowrap"}>
            <IconButton onClick={hideInstaller}>
              <Cancel />
            </IconButton>
            <Grid container flexGrow={1} justifyContent={"space-between"} alignItems={"center"} sx={{px: 2}} flexWrap={"nowrap"}>
              <Typography> Install Shago Meals </Typography>
              <StyledButton sx={{
                fontSize: "14px",
                fontWeight: "600 !important",
                px: 2,
                py: 1.4
              }} variant='warning' size={"small"} onClick={installPWA}> Install now </StyledButton>
            </Grid>
          </Grid>
        </Box>
      }

      <PageFooter restaurant={restaurant} />
    </RestaurantProvider>
    </Page>
  );
}

export default AppLayout;

