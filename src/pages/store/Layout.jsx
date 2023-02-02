import React, {useEffect, useState, useContext, createContext} from 'react';
import {
  Routes,
  Route,
  Redirect,
  useMatch,
  useParams
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
import {redirect, parseDate} from '../../helpers/utils';
import { Navbar, Sidebar } from '../../components/nav';
import { Page } from '../../components';
import GlobalStore, {RestaurantProvider} from '../../helpers/store';

import StoreHomePage from './Home';
import StoreMenuPage from './Menu';
import MenuItemPage from './ItemDetail';
import BuyerCartPage from './Cart';
import CheckoutPage from './Checkout';
import CheckoutCompletePage from './CheckoutComplete';
import SettingsHomePage from '../account/Home';


function Layout({ ...params }) {
  let app, placeStore;
  const [placeState, setPlaceState] = useState(placeStore)
  const [loading, setLoadingState] = useState(true)
  const [restaurant, setRestaurant] = useState(null)

  const {notify, apiUrl} = useContext(GlobalStore);

  const {place} = useParams();


  placeStore = {
    clipboardCopy,
    placeState,
    setPlaceState,
    parseDate,
    place,
    restaurant,
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

  useEffect(() => {
    getRestaurant()

    setTimeout(() => setLoadingState(false), 2000)
  }, [])


  if (loading){
    return null
  }

  return (
    <Page sx={{p: '0px !important'}}>
      <RestaurantProvider value={placeStore}>
      <Navbar />
      <Routes>
        <Route path="/account" element={<SettingsHomePage place={place} />} />
        <Route path="/checkout/next/" element={<CheckoutCompletePage place={place} />} />
        <Route path="/checkout" element={<CheckoutPage place={place} />} />
        <Route path="/menu/:itemId" element={<MenuItemPage place={place} />} />
        <Route path="/menu" element={<StoreMenuPage place={place} />} />
        <Route path="/cart" element={<BuyerCartPage place={place} />} />
        <Route path="/" element={<StoreHomePage place={place} />} />

      </Routes>
    </RestaurantProvider>
    </Page>
  );
}

export default Layout;

