// eslint-disable no-unused-vars

import * as React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListItemIcon from '@mui/material/ListItemIcon';
import Person from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Storefront';
import LocationIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CartIcon from '@mui/icons-material/ShoppingCart';
import TakeoutDiningIcon from '@mui/icons-material/TakeoutDining';
import NotificationIcon from '@mui/icons-material/Notifications';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import {Link, NavLink, matchPath, useLocation} from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import GlobalStore, {RestaurantStore} from '../helpers/store';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { Backdrop, CircularProgress, ClickAwayListener, Divider, Input, List, ListItem, Typography } from '@mui/material';
import Select from '@mui/material/Select';
import { StyledButton } from '.';
import ConfirmIcon from  '@mui/icons-material/ThumbUp'
import { Close } from '@mui/icons-material';


export function Searchbar({ onDataFetch, }){
	const [open, setState] = React.useState(false);
	const [query, setQuery] = React.useState("");
	const [results, setResults] = React.useState(null);
	const text = React.useRef();
	const bar = React.useRef();
	const {notify, apiUrl, org} = React.useContext(GlobalStore)

	function clearInput(){
		setQuery("");
		text.current.focus();
	}

	function onInput(){
		let {value} = text.current
		setQuery(value)
		performSearch(value)
	}

	async function performSearch(text){
		let res, data, results;

		try{
			res = await fetch(`${apiUrl}/search/?org=${org}&query=${query}`);
			data = await res.json();

			if (res.status === 200){
				setResults(data.data);
			}else{
				notify('error', "An error occurred");
			}
		}catch(err){
			notify('error', "Something went wrong");
		}
	}


	function toggleBar(){
		setState(!open);
		if(open){
			bar.current.classList.remove('open');
			setResults(null);
		}else{
			bar.current.classList.add('open');
			text.current.focus();
		}
	}

	return(
		<Box ref={bar} className="searchbar-wrapper">
			<Grid container wrap="nowrap" className="searchbar"
			 sx={{
			 	width: open ? '100%' : '45px'
			 }}
			 >
		    <IconButton onClick={toggleBar} className="" sx={{mx: .3, mr: 0}}>
					<SearchIcon sx={{color: 'inherit'}}/>
				</IconButton>

				<Grid container wrap="nowrap">
					<input onInput={onInput} ref={text} value={query} type="text" className="search-input" />
			    
			    <IconButton className="" sx={{mx: .5}}>
						<CloseIcon onClick={clearInput} sx={{color: 'inherit'}}/>
					</IconButton>
				</Grid>
			</Grid>

			<div className="results-wrapper">
				<div className="search-results">
					<h3> Results </h3>

					{results && 
						<div>

							<div> 
								<h4> Staff </h4>
								{
									results?.staff?.map((staff, idx) => <li> {staff.user.firstName} {staff.user.lastName} </li>)
								}
							</div>
							
						</div>
					}
				</div>
			</div>
		</Box>
	)
}


export const PageFooter = ({ restaurant }) =>{
	return(
	  <Box className="" sx={{ mt: 5, background: 'orange', px: 4, py: 6  }}>
		<Grid container>
			<Grid item xs={12} md={8}>
				<Typography sx={{my: 1.3, opacity: .95, fontWeight: 600, fontSize: 23}}> {restaurant?.name}  </Typography>
				<Typography style={{
					my: .25,
				fontSize: 15,
				maxWidth: 400,
				}}>
				We are the best restaruant in Nigeria with all you can eat.
				Here's some generic info about us. This info is default to all new stores on Shago!
				</Typography>
			</Grid>

			<Grid item xs={12} md={4} sx={{textAlign: 'left'}}>
				<Typography sx={{my: 1.3, fontWeight: 600, fontSize: 20}}> Useful Links </Typography>
				<List>
					<ListItem> <Link to={'/'}> Home </Link> </ListItem>
					<ListItem> <Link to={'/#about'}> About Us </Link> </ListItem>
					<ListItem> <Link to={'/menu'}> Our Menu </Link> </ListItem>
					<ListItem> <Link to={'/#contact'}> Contact Us </Link> </ListItem>
				</List>
			</Grid>
		</Grid>
	  </Box>
	)
}
  

export function Navbar({ showCart, ...props }){
	const {
		place, restaurant, notificationAccess,
		requestNotificationPerm, openSidebar
	} = React.useContext(RestaurantStore)
	
	return(
		<Box className="navbar">
			<Grid container sx={{ }} alignItems={'center'} justifyContent={'space-between'} wrap='nowrap'>
				<Grid item>
					<IconButton onClick={openSidebar}> <MenuIcon /> </IconButton>	
				</Grid>
				
				<Grid item flex={1}>
					<Typography className='ellipsis'> {restaurant?.name} </Typography>
				</Grid>

				<Grid item>
					<Tooltip title="Cart" size="medium">
						<IconButton onClick={showCart} sx={{mx: 1, px: 1}}>
							<CartIcon sx={{color: 'inherit'}}/>
						</IconButton>
					</Tooltip>
					
					<Tooltip title="Search" size="medium">
						<IconButton> <SearchIcon /> </IconButton>	
					</Tooltip>

				</Grid>
			</Grid>
		</Box>
	)
}



export const Sidebar = ({ onClose, showNav, ...props }) => {
	const {
		place, restaurant, notificationAccess,
		requestNotificationPerm,
	} = React.useContext(RestaurantStore)
	
	const NavLinks = [
		{
			url: '/',
			label: 'Home',
			icon: <HomeIcon sx={{color: 'inherit'}}/>,
		},
		{
			url: '/menu',
			label: 'Menu',
			icon: <MenuIcon sx={{color: 'inherit'}}/>,
		},
		{
			url: '/menu',
			label: 'Menu',
			icon: <MenuIcon sx={{color: 'inherit'}}/>,
		},
	]

	const { pathname: activePath, ...navProps } = useLocation()
	const _navPath =  Array.from(activePath.split('/')).toReversed()[0] || "Home Page"
	const {apiUrl, getUserData, notify, logoutUser} = React.useContext(GlobalStore)
	const settingsRef = React.useRef();
	const notificationsRef = React.useRef();
	const [settingAnchor, setSettingAnchor] = React.useState(null);
	const [alertAnchor, setAlertAnchor] = React.useState(null);
	const openSettings = Boolean(settingAnchor);
	const openNotifications = Boolean(alertAnchor);
	const isMobileDevice = useMediaQuery('(max-width: 768px)')
	let navLocation;

	switch (_navPath) {
		case '':
			navLocation = 'Home Page';
			break
		case 'cart':
			navLocation = 'Cart';
			break
		case 'menu':
			navLocation = 'Menu';
			break
		case 'settings':
			navLocation = 'Settings';
			break
		case 'orders':
			navLocation = 'My Orders';
			break
		default:
			navLocation = 'Home Page';
	}

	function handleMenuClose(){
		setSettingAnchor(null)
	}

	function toggleAccountMenu(){
		if (openSettings)
			setSettingAnchor(null)
		else
			setSettingAnchor(settingsRef.current)
	}

	function toggleAlerts(){
		if(notificationAccess){
			if (openNotifications)
				setAlertAnchor(null)
			else
				setAlertAnchor(notificationsRef.current)
		}else{
			requestNotificationPerm()
		}
	}

	return (
		<Box 
			sx={{
			position: 'fixed',
			left: '0px',
			top: '0px',
			width: '100%',
			maxWidth: '450px',
			background: '#fff',
			zIndex: 3000,
			height: '100vh',
			transform: showNav ? `translateX(0px)` : 'translateX(-450px)',
			transition: '.5s',
			py: 3,
			boxShadow: '-1px -1px 15px 0px #04040463'
			}}
		>
            <IconButton onClick={onClose} sx={{ position: 'absolute', right: '15px', top: '10px'}}><Close /></IconButton>

			<Stack className="" sx={{ py: 4, px: 2}}>
				{
					NavLinks.map(({ url, icon, label }, idx) => 
						<NavLink to={url} key={idx}>
							<IconButton sx={{ px: 1, py: 2, borderRadius: 2, my: 1.2, width: '100%', justifyContent: 'flex-start'}}>
								{icon}
								<Typography ml={2}> {label} </Typography>
							</IconButton>
						</NavLink>
					)
				}
			</Stack>
		</Box>
	)
}


export const NotificationBox = ({ notify, ...props }) => {
	const [notifications, setNotifications] = React.useState(null);
	const [loading, setLoadingState] = React.useState(true);

	async function fetchNotifications(){
		const res = await fetch(`${props.apiUrl}/notifications/?place=${props.place}`, {
			headers: {"Authorization": `Token ${props.token}`}
		})

		const data = await res.json()
		if (!data.error){
			setNotifications(data.notifications)
			setTimeout(() => setLoadingState(false), 2000)
		} else {
			console.log("Error getting notifications:", data.message)
			notify('error', "Error getting notifications!")
		}
	}

	React.useEffect(()=>{
		fetchNotifications()
	}, [])

	return(
		<ClickAwayListener onClickAway={props.onClose}>
			<StyledMenu
				onLoad={fetchNotifications}
				anchor={props.anchor}
				id="notifications"
				open={props.open}
				onClose={props.onClose}
				onClick={props.onClick}
				sx={{minWidth: '300px !important'}}
			> {loading ? (
				<React.Fragment>
					<CircularProgress sx={{ fontSize: 45, color: 'orange' }} />
				</React.Fragment>
			) : (
				<React.Fragment>
					{notifications?.map(alert => {
						<MenuItem>
							<Typography> {alert} </Typography>
						</MenuItem>
						}
					)}
				</React.Fragment>
				)
			}
				{notifications?.length > 0 ? <NavLink to="/notifications">
					<MenuItem>
						See all
					</MenuItem>
				</NavLink> : 
				<MenuItem>
					<MenuIcon sx={{mr: 2}}> <NotificationIcon /> </MenuIcon>
					<Typography> Nothing to show here. </Typography>
				</MenuItem>
				}
			</StyledMenu>
		</ClickAwayListener>
	)
}


export const StyledMenu = ({ onClose, onClick, open, id, anchor, onLoad, children, sx, ...props }) => {
	return(
		<Menu
			anchorEl={anchor}
			id={id}
			open={open}
			onClose={onClose}
			onClick={onClick}
			onFocus={onLoad}
			PaperProps={{
			elevation: 20,
			sx: {
				top: 20,
				overflow: 'visible',
				filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
				mt: 1.5,
				'& .MuiAvatar-root': {
					width: 32,
					height: 32,
					ml: -0.5,
					mr: 1,
				},
				'& .MuiPaper-root': {
					top: '60 !important',
				},
				'&:before': {
					content: '""',
					display: 'block',
					position: 'absolute',
					top: 0,
					right: 14,
					width: 10,
					height: 10,
					bgcolor: 'background.paper',
					transform: 'translateY(-20%) rotate(45deg)',
					zIndex: 10,
				},
				py: 0,
			},
			...sx}}
			transformOrigin={{ horizontal: 'right', vertical: 'top' }}
			anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			{...props}
		>{children}</Menu>
	)
}


export const LocationBar = ({ onClose, barRef }) => {
	const [branch, setBranch] = React.useState(null);
	const [location, setLocation] = React.useState("");

	return(
		<Box ref={barRef} id='location-bar' className='location-bar hidden' sx={{p: 2}}>
			<StyledButton
				onClick={onClose}
				sx={{color: 'orangered', background: 'transparent',
					'&:hover': {
						background: 'transparent'
					}
				}}
				icon={<CloseIcon />} />
			
			<Typography sx={{mt: 3, fontSize: 18, fontWeight: '600'}}> Enter your delivery location </Typography>

			<Divider sx={{my: 3}} />

			<Box sx={{mt: 4}}>
				<Typography sx={{fontSize: 18, mb: .5}}> Enter your delivery location </Typography>
				<Input disableUnderline className='input' />
			</Box>

			<Box className='form-group' sx={{mt: 4}}>
				<Typography sx={{fontSize: 18, mb: .5}}> Select a branch closest to you </Typography>

				<Select aria-haspopup  notched sx={{p: 0, zIndex: '2001'}} className='input' value={branch}>
					<MenuItem value=""> Choose a branch </MenuItem>
					{/* <option> Choose an option </option> */}
				</Select>
			</Box>

			<Box sx={{mt: 3}} justifyContent={'center'} display={'flex'}>
				<StyledButton icon={<ConfirmIcon sx={{mr: 2}} />} variant='warning'>
					<Typography sx={{fontWeight: '600'}}> Confirm Location </Typography>
				</StyledButton>
			</Box>
		</Box>
	)
}



// Profile Menu
/**
 * 
 * 
 * <StyledMenu
				anchor={settingAnchor}
				id="account-menu"
				open={openSettings}
				onClose={handleMenuClose}
				onClick={handleMenuClose}
			>
				<NavLink to={`me/orders`} style={{ textDecoration: "none", color: "inherit"}}>
					<MenuItem sx={{width: 250, py: 2, }} onClick={handleMenuClose}>
							<ListItemIcon>
								<NotificationIcon fontSize="small" />
							</ListItemIcon>
							Notifications
					</MenuItem>
				</NavLink>

				<NavLink to={`me/orders`} style={{ textDecoration: "none", color: "inherit"}}>
					<MenuItem sx={{width: 250, py: 2, }} onClick={handleMenuClose}>
							<ListItemIcon>
								<TakeoutDiningIcon fontSize="small" />
							</ListItemIcon>
							My Orders
					</MenuItem>
				</NavLink>

				<NavLink to={`me/settings`} style={{ textDecoration: "none", color: "inherit"}}>
					<MenuItem sx={{width: 250, py: 2, }} onClick={handleMenuClose}>
						<ListItemIcon>
							<Settings fontSize="small" />
						</ListItemIcon>
						Settings
					</MenuItem>
				</NavLink>

				<MenuItem sx={{width: 250, py: 2, }} onClick={logoutUser}>
					<ListItemIcon>
						<Logout fontSize="small" />
					</ListItemIcon>
					Logout
				</MenuItem>
			</StyledMenu>
 * 
*/