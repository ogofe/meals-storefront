import React, {Fragment, useEffect, useContext, useState} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/Stars';
import LocalDelivery from '@mui/icons-material/LocalShipping';
import Typography from '@mui/material/Typography';
import GlobalStore from '../helpers/store';
import {Page} from '../components'


const {sessionStorage, localStorage} = window;

export const LoadScreen = ({ ...props }) => {
	const {redirect, notify, setUserProfile} = useContext(GlobalStore);
	const [loggedIn, setLoginState] = useState(null);
	const [loading, setLoadingState] = useState(true);

	function getUserData(){
		let data = sessionStorage.getItem('auth-user');
		if (data === undefined || data === null || data === ""){
			return [false, null]
		}

		data = JSON.parse(data)
		return [true, data]
	}


	useEffect(() => {
		async function init(){
			const [isAuthenticated, userData] = getUserData();

			if (isAuthenticated){
				setUserProfile(userData)
				setTimeout(() => redirect('/the-ring/'), 1000)
			}else{
				redirect('/login?rdr_next=/the-ring/')
			}
		}
		init();
	}, [])

	if (loggedIn === false){
		return(
			<Page>
				
			</Page>
		)
	}

	if (loggedIn === true){

	}

	// loggedIn === null (true) -> Page is loading...
	return(
		<Page>
			
		</Page>
	)
}


export default LoadScreen;
