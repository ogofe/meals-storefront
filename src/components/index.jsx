import React, {useContext, useState} from 'react';
// import {connect} from 'socket.io-client';

import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import CashIcon from '@mui/icons-material/MonetizationOn';

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
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import Alert from '@mui/material/Alert';
import MuiLink from '@mui/material/Link';
import AlertTitle from '@mui/material/AlertTitle';
import Rating from '@mui/material/Rating';
import useMediaQuery from '@mui/material/useMediaQuery';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import GlobalStore, {RestaurantStore} from '../helpers/store';
import { Badge, Icon, TextField, Button, Stack, Chip } from '@mui/material';
import ErrorIcon from '@mui/icons-material/WarningAmber'
import { redirect } from '../helpers/utils';

const theme = {
  accent_color: '#ff911b',
  bg_color: '#000',
  // font: 'Poppins',
  font: 'Roboto',
  text_color: '#fff'
}


export const MenuHeader = ({ }) => {
	const {restaurant, axios} = useContext(RestaurantStore);
	const isMoblieDevice =  useMediaQuery('(max-width: 385px)');

  return(
    <Box className={`menu-header ${isMoblieDevice && 'mobile-device'}`} 
				sx={{
					py: 10,
					px: 4,
					display: 'flex',
					justifyContent: 'flex-end',
					flexWrap: 'wrap-reverse',
					flexDirection: 'row-reverse',
					alignItems: 'center',
					bgcolor: theme.bg_color,
				}}
			>
				<Typography sx={{
					fontSize: "20px",
					fontWeight: 800,
					fontFamily: theme.font,
					padding: 2,
          color: theme.text_color
				}}> {restaurant?.name} </Typography>

				<Box className='image-wrapper'  sx={{
					width: 150,
					height: 150,
					borderRadius: 30,
					border: '3px solid sandybrown',
					p: 0.25
				}}>
					<img alt='' src={restaurant?.logo_url} style={{
						borderRadius: '300px',
						width: '100%', 
						height: '100%',
					}} />
				</Box>

			</Box>
  )
}



export const ErrorUI = (error) => {
  const [message, setMessage] = useState(JSON.stringify(error));
  const {onLine} = window.navigator

  const handleRefresh = () => {
    if (!onLine){
      setTimeout(() => document.location.reload(), 1800)
      return setMessage("Reloading Page <br> Please Wait... ");
    }else{
      setTimeout(() => document.location.reload(), 1800)
      return setMessage("You are currently offline. <br> Please connect to the internet to continue.");
    }
  };

  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} style={{ height: '100vh'}}>
      <Stack style={{ textAlign: "center", py: 4, }}>
        <Box container>
          <ErrorIcon sx={{height: '12rem', width: '12rem'}} color={'warning'} />  
        </Box>
        
        <Box sx={{px: 2}}>
          <Typography
            fullwidth
            style={{ marginTop: 10, fontSize: '16px' }}
            dangerouslySetInnerHTML={{__html: message}}
          ></Typography>
        </Box>

        <Grid container sx={{my: 3}} gap={2}>
          <Grid item>
            <Button disableElevation variant="contained" color="primary" onClick={handleRefresh}>
              Refresh Page
            </Button>
          </Grid>

          <Grid item>
            <Button disableElevation variant="contained" color="primary" onClick={() => redirect('/')}>
              Back to Menu
            </Button>
          </Grid>

        </Grid>
      </Stack>
    </Box>
  );
};


export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  } 

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    console.log(error, info.componentStack);
    // this.setState({ ...this.state, error:  error })
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <ErrorUI error={this.state.error} />
      );
    }

    return this.props.children;
  }
}


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


export function CategoryPill({ label, icon, active, ...props }){
  return(
    <Button disableRipple {...props} sx={{
        background: active ? 'rgba(189, 174, 152, 0.82)' : 'transparent',
        color: active ? '#fff' : '#000',
        fontWeight: '800 !important',
        borderRadius: 0,
        borderBottom: '4px solid',
        minWidth: 'max-content',
        borderColor: active ? 'rgba(239, 109, 23, 0.82)' : '#000',
        px: 1.5, py: 1,
        cursor: 'pointer',
        ':hover': {
          backgroundColor: 'rgba(189, 174, 152, 0.82)',
        }
      }}>
        {icon && icon}
        <Typography sx={{ color: 'inherit'}}> {label} </Typography>
    </Button>
  )
}


export function ProductCard({ item, ...props }){
  const {place, restaurant, axios, requestNotificationPerm, nativeNotify} = useContext(RestaurantStore);
  const {getUserData, notify, apiUrl, updateManifest} = useContext(GlobalStore);
  const { token } = getUserData();

  async function addToCart(){
    let data, installed = false;

    if (window.localStorage.getItem(`${restaurant.slug}-shago-installed`) === "true"){
      installed = true
    }

    try{
      const payload = JSON.stringify({
        action: 'add-to-cart',
        item: item.slug,
        qty: 1,
      })
      const res = await axios.post(`/cart/`, payload);

      if (res.status === 200){
        nativeNotify('Success', "Item added to cart")
      }else{
        notify('error', data.message)
      }
    }catch(err){
      notify('error', err.message, 90000)
    }


    if (!installed){
      updateManifest({
        name: `${restaurant.name}`,
        short_name: `${restaurant.name}`,
        description: `Order your favorite meals from ${restaurant.name} - Powered by By Shago Meals`,
        icons: [
          {
          src: restaurant.logo,
          sizes: "192x192",
          type: "image/png"
          }
        ],
        start_url: "."
      })
    }
  }
  
  return (
    <Box  className="product-card">
      <Grid container justifyContent={'space-between'}>
        <Grid item sx={{p: 1}} flex={1}>
          <Typography component="h6" className="product-title" sx={{my: .25}}> {item.name} </Typography>

          <Grid container alignItems={'center'} justifyContent={'flex-start'}> 
            <Typography sx={{fontWeight: 600, mr: 1.25 }} className="product-price"> ₦{normalizeDigits(item.price)} </Typography>            

            <Box className="d-flex" sx={{alignItems: 'center'}}>
              <StarIcon sx={{fontSize: 15, mr: .25, color: 'orangered'}} /> 
              <Typography sx={{ color: 'orangered', fontWeight: 600 }} > {item.rating} </Typography>
            </Box>
          </Grid>
          
          <Chip sx={{ fontWeight: 600, borderRadius: '2px', bgcolor: theme.accent_color }} className="product-category" label={item.category} />

        </Grid>

        <Grid item className="product-card-image">
          <Link to={`/menu/${item.slug}/`} className="">
            <img alt="" className="image" src={item?.image?.url} />
          </Link>
        </Grid>
      </Grid>

      <StyledButton onClick={() => addToCart()} icon={<CartIcon sx={{mr: 1.25}} />} sx={{ fontSize: 13, mt: .25, fontWeight: 600, width: '100%'}} variant="warning"> Add to Cart </StyledButton>

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
    <TableRow sx={{ padding: '7px !important'}} key={props?.key || null}>
      <TableCell>
        <Box className="d-flex" sx={{ alignItems: 'center', justifyContent: 'flex-start'}}>
          <Box sx={{width: '70px', height: '50px'}} >
            <img alt='' style={{ width: '100%', height: '100%', borderRadius: '10px'}} src={item?.item?.image?.url} />
          </Box>
          <Typography sx={{ ml: 2}}> {item?.item?.name} </Typography>
        </Box>
      </TableCell>
      <TableCell> {item.quantity} </TableCell>
      <TableCell> ₦{normalizeDigits(String(item.total))} </TableCell>
      <TableCell sx={{ position: 'sticky', backgroundColor: '#fff', right: '0px', width: '20px'}}> <IconButton onClick={() => removeFromCart(item?.id)}> <CancelIcon sx={{color: 'orangered'}} /> </IconButton> </TableCell>
    </TableRow>
  )
}


export function OrderList({ orders, onChange, containerStyle, removable, ...props }){
  return(
    <Paper style={containerStyle}>
      <TableContainer>
        <Table sx={{ minWidth: "700px"}}>
          <TableHead>
            <TableCell> Item </TableCell>
            <TableCell> Qty </TableCell>
            <TableCell> Sub Total </TableCell>
            <TableCell> Action </TableCell>
          </TableHead>

          <TableBody>
            {orders.map(order => <OrderListItem onChange={onChange} item={order} key={order.id} />)}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}


export function OrderItem({ order, ...props }){
  return(
    <Box {...props.key} className={'product-card'} sx={{ mb: 5,  px: 3, py: 2, maxWidth: '320px'}}>

      <Grid container className='d-flex' sx={{alignItems: 'center'}}>
        <Typography sx={{ fontWeight: 600}}> {order?.order_id} </Typography>
        <StyledBadge bg={order.status}>
          {String(order?.status).toLocaleUpperCase()}
        </StyledBadge>
      </Grid>

      <Box sx={{
        mt: 2
      }}>
        
        <Typography className='d-flex' sx={{fontWeight: 600}}> <CalendarIcon /> {order?.created_on} ago </Typography>
        <Grid container className='d-flex' sx={{alignItems: 'center'}}>
          <Typography sx={{my: 2, fontWeight: 600}} className='d-flex'> <MenuIcon sx={{mr: 2}} />  {order?.items.length} </Typography>
          <Typography className='d-flex' sx={{fontWeight: 600}}> <CashIcon sx={{mr: 1}} /> {normalizeDigits(String(order?.subtotal))} </Typography>
        </Grid>

        <NavLink to={`${order.order_id}`} style={{textDecoration: 'none'}}>
          <StyledButton variant='warning' sx={{ fontSize: 15, fontWeight: 600, mx: 0, mt: 1, px: 3}}> View Order </StyledButton>
        </NavLink>
      </Box>
    </Box>
  )
}


export function StyledBadge({ bg='pending', children, ...props}){
  const BG = {
    'pending': '#ff7907',
    'ready': '#625df5',
    'delivered': '#2be542',
  }

  
  return(
    <Badge sx={{
      width: 'max-content',
      background: BG[bg],
      color: '#fff',
      padding: '5px 12px 8px 12px',
      margin: 0,
      borderRadius: '30px',
      fontWeight: 600
    }}> {children} </Badge>
  )
}


