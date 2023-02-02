// eslint-disable no-unused-vars

import * as React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListItemIcon from '@mui/material/ListItemIcon';
import Person from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Storefront';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CartIcon from '@mui/icons-material/ShoppingCart';
import Notifications from '@mui/icons-material/Notifications';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import {NavLink, matchPath, useLocation} from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import GlobalStore, {RestaurantStore} from '../helpers/store';

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

export function Navbar({ toggleNav }){
  const {theme, switchTheme,} = React.useContext(GlobalStore)
  const {place, restaurant} = React.useContext(RestaurantStore)
  const anchor = React.useRef();
  const [open, setMenuState] = React.useState(false);
  const [navOpen, setNavState] = React.useState(false);
  const { pathname: activePath } = useLocation()


	function onDataFetch(){

	}

	return(
		<Box className="navbar">
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mr: 2}}>
				<Tooltip title={restaurant?.name || "Home page"} size="large">
					<NavLink to={`/${place}`}>
						<Box sx={{
							width: 50,
							height: 50,
							borderRadius: 30,
							px: 2
						 }}
						>
							<img src={restaurant?.logo} style={{
								borderRadius: '50%',
								width: '100%', 
								height: '100%',
							}} />
						</Box>
					</NavLink>
				</Tooltip>
			</Box>


			<Box className="nav" sx={{ display: 'flex', padding: '0px 10px'}}>
				<Tooltip title="Menu" size="medium">
				  <NavLink to={`/${place}/menu/`}>
						<IconButton sx={{mx: 1.2, px: 1}}>
							<HomeIcon sx={{color: 'inherit'}}/>
						</IconButton>
					</NavLink>
				</Tooltip>
		        
		    <Tooltip title="Cart" size="medium">
		      <NavLink to={`/${place}/cart/`}>
						<IconButton sx={{mx: 1.2, px: 1}}>
							<CartIcon sx={{color: 'inherit'}}/>
						</IconButton>
					</NavLink>
				</Tooltip>

        <Tooltip title="Account settings">
          <NavLink to={`/${place}/account/`}>
						<IconButton id="account-toggle" ref={anchor} sx={{mx: 1}}>
							<Person sx={{color: 'inherit'}}/>
						</IconButton>
					</NavLink>
				</Tooltip>
			</Box>
		</Box>
	)
}
