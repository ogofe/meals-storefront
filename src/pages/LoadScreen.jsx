import React, {Fragment, useEffect, useContext, useState} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/Stars';
import LocalDelivery from '@mui/icons-material/LocalShipping';
import Typography from '@mui/material/Typography';
import GlobalStore from '../helpers/store';
import {Page} from '../components'
import { Helmet } from "react-helmet";
import { Route, Routes } from 'react-router-dom';
import PlaceScreen from './store/Layout';


const {sessionStorage, localStorage} = window;


export const LoadScreen = ({ ...props }) => {
	const {redirect, notify, setUserProfile, authState, getUserData} = useContext(GlobalStore);
	const [loggedIn, setLoginState] = useState(null);
	const [loading, setLoadingState] = useState(true);
	const path = window.location.pathname


	useEffect(() => {
		async function init(){
			const userData = getUserData();
			if (userData){
				setUserProfile(userData)
				setTimeout(() => setLoginState(true), 1000)
			}else{
				redirect(`/login?rdr_next=${path}`)
			}
		}
		init();
	}, [authState])

	if (loggedIn === false){
		return(<Page></Page>)
	}

	if (loggedIn === true){
		return(
			<Routes>
				<Route path="/*" element={<PlaceScreen />} />
			</Routes>
		)
	}

	// loggedIn === null (true) -> Page is loading...
	return	(<Page></Page>)
}


export default LoadScreen;
