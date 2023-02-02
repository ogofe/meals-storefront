import React, {Fragment, useEffect, useState, useContext} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import RightIcon from '@mui/icons-material/ChevronRight';
import LeftIcon from '@mui/icons-material/ChevronLeft';
import Typography from '@mui/material/Typography';
import {useNavigate} from 'react-router-dom';
import GlobalStore, {RestaurantStore} from '../../helpers/store';
import {DashboardLoader} from '../../components/loaders';
import {Page, OrderList, StyledButton} from '../../components/index';


export const CartPage = ({ ...props }) => {
	const {userProfile, apiUrl, getUserData, notify} = useContext(GlobalStore);
	const { restaurant, place, } = useContext(RestaurantStore);
	const [cart, setCart] = useState(null);
	const [loading, setLoadingState] = useState(true);
	const { user, token } = getUserData();
	const navigate = useNavigate();

	async function getData(){
		let res, data;

		try{
			res = await fetch(`${apiUrl}/cart/?place=${place}`, {
				headers: {'Authorization': `Token ${token}`}
			});
			
			data = await res.json()
			
			if (res.ok){
				setCart(data.cart)
				notify('success', 'Got data')
			}else{
				notify('error', (data.message || 'Something went wrong!'))
			}
			setTimeout(() => setLoadingState(false), 1200);
		}catch(err){
			notify('error', err.message)
			console.log('error', err)
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
		<Page sx={{ maxWidth: 1000, mx: 'auto'}}>
			<Box className="titlebar" sx={{my: 3}}>
				<Typography className="title"> Your Cart </Typography>
			</Box>

			<Box sx={{my: 3}}>
				<OrderList orders={cart.items} onChange={getData} removable={true} />
			</Box>

			<Box sx={{my: 3, textAlign: 'center'}}>
				<StyledButton onClick={() => navigate(`/${place}/menu/`)} variant="secondary" sx={{mt: 4, ml: 'auto', mr: 3}}>
					<LeftIcon />
					<Typography sx={{fontWeight: 600}}> Back To Menu </Typography>
				</StyledButton>

				{(cart?.items?.length > 0) && <StyledButton onClick={() => navigate(`/${place}/checkout/`)} variant="warning" sx={{mt: 4, ml: 'auto'}}>
					<Typography sx={{fontWeight: 600}}> Proceed To Checkout </Typography>
					<RightIcon />
				</StyledButton>}
			</Box>

			
		</Page>
	)
}


export default CartPage;
