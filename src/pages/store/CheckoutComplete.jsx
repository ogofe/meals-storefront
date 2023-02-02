import React, {Fragment, useEffect, useState, useContext} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/Stars';
import LocalDelivery from '@mui/icons-material/LocalShipping';
import Typography from '@mui/material/Typography';

import GlobalStore from '../../helpers/store';
import {DashboardLoader} from '../../components/loaders';
import {Page, ProductCard} from '../../components/index';


export const StoreHomePage = ({ ...props }) => {
	const {token, apiUrl, place, theme, notify} = useContext(GlobalStore);
	const [data, setData] = useState(null);
	const [loading, setLoadingState] = useState(true);

	async function getData(){
		let res, info;

		try{
			res = await fetch(`${apiUrl}/menu/?place=${place}`);
			info = await res.json()
			if (res.status === 200){
				setData(info.data)
				notify('success', 'Got data')
				console.log(info)
			}else{
				notify('error', 'Something went wrong!')
			}
			setTimeout(() => setLoadingState(false), 1200);
		}catch(err){
			notify('error', err.message)
			setTimeout(() => setLoadingState(false), 1200);
		}
	}

	useEffect(() => {
		async function init(){
			await getData();
		}
		init();
	}, [])

	if (loading){
		return(
			<Page>
				<DashboardLoader loading={loading} />
			</Page>
		)
	}

	return(
		<Page>
			<Box className="titlebar" sx={{my: 2}}>
				<Typography className="title"> Your Cart </Typography>
			</Box>

			
		</Page>
	)
}


export default StoreHomePage;
