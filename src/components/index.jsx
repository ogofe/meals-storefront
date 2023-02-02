import React, {useContext, useState} from 'react';
// import {connect} from 'socket.io-client';

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

import CartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';

import { normalizeDigits } from '../utils';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import {NavLink, Link, useNavigate, useLocation} from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import Alert from '@mui/material/Alert';
import MuiLink from '@mui/material/Link';
import AlertTitle from '@mui/material/AlertTitle';
import Rating from '@mui/material/Rating';
import useMediaQuery from '@mui/material/useMediaQuery';
import FastfoodIcon from '@mui/icons-material/Fastfood';
// import { Bar } from 'react-chartjs-2';
import GlobalStore, {RestaurantStore} from '../helpers/store';


export const BackButton = ({ path, ...props }) => {
  const navigate = useNavigate()

  function goBack(){
    navigate(path)
  }

  return(
  <StyledButton variant="dark" onClick={goBack} icon={<ChevronLeft/>} > 
    <Typography sx={{px: 1.2}}> Back </Typography>
  </StyledButton>
  )
}

export function Page({children, ...props}){
  return <Box className="page" {...props}>{children}</Box>
}

export function BasicRating() {
  const [value, setValue] = React.useState(2);

  return (
    <Box
      sx={{
        '& > legend': { mt: 2 },
      }}
    >
      <Typography component="legend">Controlled</Typography>
      <Rating
        name="simple-controlled"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      />
    </Box>
  );
}


export const Separator = ({ orient, mt, mb, ...props }) => {
  return <hr style={{
      marginTop: mt ? mt : '15px',
      marginBottom: mb ? mb : '15px',
    }}
  />
}


export const StyledButton = ({ sx, variant='primary', onClick, href, icon, ...props }) => {

  const BG_COLORS = {
    'primary': 'cornflowerblue',
    'dark': 'black',
    'secondary': 'purple',
    'danger': 'red',
    'info': 'teal',
    'warning': 'orange',
    'success': 'limegreen',
    'white': '#fcfcfc',
  }

  return(
    <IconButton sx={{
       borderRadius: '5px',
       background: BG_COLORS[variant],
       color: '#fff',
       ':hover': {background: BG_COLORS[variant], opacity: .7},
       ...sx
      }} onClick={onClick} {...props}>
        {icon}
        {props.children}
      </IconButton>
  )
}


export const StyledLinkButton = ({ style, variant='primary', href, icon, ...props }) => {

  const BG_COLORS = {
    'primary': 'cornflowerblue',
    'dark': 'black',
    'secondary': 'purple',
    'danger': 'red',
    'info': 'teal',
    'warning': 'orange',
    'success': 'limegreen',
    'white': '#fcfcfc',
  }

  return(
    <a 
      href={href}
      style={{
       borderRadius: '5px',
       background: BG_COLORS[variant],
       color: '#fff',
       minWidth: '100%',
       display: 'inline-flex',
       padding: '10px',
       textDecoration: 'none',
       cursor: 'pointer',
       marginBottom: '10px',
       justifyContent: 'center',
       ...style,
      }} 
      {...props}
      >
        {icon}
        {props.children}
    </a>
  )
}


export function CategoryPill({ label, icon, ...props }){
  return(
    <IconButton {...props} sx={{
        background: '#f4f4f4',
        fontWeight: '800 !important',
        borderRadius: '50px',
        minWidth: 'max-content',
        px: 2.5, py: 1.5, m: 1,
        cursor: 'pointer',
        ':hover': {
          opacity: .7,
          transition: .3,
          background: 'lightgrey'
        }
      }}>
        {icon && icon}
        <Typography sx={{ color: '#000'}}> {label} </Typography>
    </IconButton>
  )
}


export function ProductCard({ item, ...props }){
  const {place} = useContext(RestaurantStore);
  const {getUserData, notify, apiUrl} = useContext(GlobalStore);
  const { user, token } = getUserData();

  async function addToCart(){
    let res, data;
    try{
      res = await fetch(`${apiUrl}/cart/?place=${place}`, {
        method: 'post',
        headers: {'Authorization': `Token ${token}`, 'Content-Type': 'application/json'},
        body: JSON.stringify({
          action: 'add-to-cart',
          item: item.slug,
          qty: 1,
        })
      });
      data = await res.json();

      if (res.ok){
        notify('success', "Item added to cart")
      }else{
        notify('error', data.message)
      }
    }catch(err){
      notify('error', err.message, 90000)
    }
  }
  
  return (
    <Box sx={{my: 2.5}} className="product-card">
      <Box className="product-card-image">
        <Link to={`/${place}/menu/${item.slug}/`} className="">
          <img className="image" src={item?.image?.url} />
        </Link>
      </Box>

      <Box sx={{p: 1}}>
        <Typography component="h6" className="product-title" sx={{my: .25}}> {item.name} </Typography>

        <Grid container className="d-flex" sx={{ mt: 1, alignItems: 'start'}}>
          <Typography sx={{fontWeight: 600 }} className="product-price"> ₦{normalizeDigits(item.price)} </Typography>

          <span style={{fontWeight: 600, opacity: .6 }}> . </span>

          <Typography sx={{ fontWeight: 600 }} className="product-category"> {item.category} </Typography>
          
          <span style={{fontWeight: 600, opacity: .6 }}> . </span>

          <Box className="d-flex" sx={{alignItems: 'center'}}>
           <StarIcon sx={{fontSize: 15, mr: .25, color: 'orangered'}} /> 
           <Typography sx={{ color: 'orangered', fontWeight: 600 }} > {item.rating} </Typography>
          </Box>
        </Grid>

        <StyledButton onClick={() => addToCart()} icon={<CartIcon sx={{mr: 1.25}} />} sx={{ fontSize: 13, mt: 3, fontWeight: 600, width: '100%'}} variant="warning"> Add to Cart </StyledButton>
      </Box>
    </Box>
  )
}

export function OrderListItem({ item, onChange, removable, ...props }){
  const {place} = useContext(RestaurantStore);
  const {getUserData, apiUrl, notify} = useContext(GlobalStore);
  const { user, token } = getUserData();


  async function removeFromCart(itemId){
    let res, data;
      try{
        res = await fetch(`${apiUrl}/cart/?place=${place}`, {
          method: 'post',
          headers: {'Authorization': `Token ${token}`, 'Content-Type': 'application/json'},
          body: JSON.stringify({
            action: 'remove-from-cart',
            item: itemId,
          })
        });
        data = await res.json();

        if (res.ok){
          notify('success', "Removed item from your cart")
        }else{
          notify('error', data.message)
        }
      }catch(err){
        notify('error', "Something went wrong")
        console.error('Error removing cart-item:', err)
      }finally{
        onChange()
      }
  }

  return(
    <TableRow key={props?.key || null}>
      <TableCell>
        <Box className="d-flex" sx={{ alignItems: 'center', justifyContent: 'flex-start'}}>
          <Box sx={{width: '70px', height: '50px'}} >
            <img style={{ width: '100%', height: '100%'}} src={item?.item?.image?.url} />
          </Box>
          <Typography sx={{ ml: 2}}> {item?.item?.name} </Typography>
        </Box>
      </TableCell>
      <TableCell> ₦{normalizeDigits(item.item.price)} </TableCell>
      <TableCell> {item.quantity} </TableCell>
      <TableCell> ₦{normalizeDigits(String(item.total))} </TableCell>
      {removable && <TableCell> <IconButton onClick={() => removeFromCart(item?.id)}> <CancelIcon sx={{color: 'orangered'}} /> </IconButton> </TableCell>}
    </TableRow>
  )
}

export function OrderList({ orders, onChange, removable, ...props }){
  return(
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableCell> Item </TableCell>
            <TableCell> Price </TableCell>
            <TableCell> Qty </TableCell>
            <TableCell> Sub Total </TableCell>
            {removable && <TableCell> </TableCell>}
          </TableHead>

          <TableBody>
            {orders.map(order => <OrderListItem onChange={onChange} removable={removable||false} item={order} key={order.id} />)}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}


