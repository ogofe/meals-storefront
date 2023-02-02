import React, {Fragment, useEffect, useState, useContext} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import LocalDelivery from '@mui/icons-material/LocalShipping';
import Typography from '@mui/material/Typography';
import {useFlutterwave, closePaymentModal} from 'flutterwave-react-v3'; // install first!
import GlobalStore, {RestaurantStore} from '../../helpers/store';
import {DashboardLoader} from '../../components/loaders';
import {Page, StyledButton, OrderList} from '../../components/index';
import { useNavigate } from 'react-router-dom';

export const StoreHomePage = ({ ...props }) => {
	const {getUserData, apiUrl, theme, notify, flutterwaveApiKey} = useContext(GlobalStore);
	const {restaurant, place} = useContext(RestaurantStore);
	const [cartData, setCartData] = useState(null);
	const [loading, setLoadingState] = useState(true);
	const [loadingPayment, setPaymentLoadingState] = useState(true);
	const { user, token } = getUserData();
	const navigate = useNavigate();
	const [totalAmount, setTotalAmount] = useState(0);

	async function onModalClose(){
		return navigate(`/${place}/checkout`) // /complete/?status=${'success'}&rdr_next=&req_rvw=true`)
	}

	async function onPaymentResponse(res){
		console.log("Payment made:", res)
		if (res.status === 'successful'){
			const receipt = {
				'flutter_ref' : res.flw_ref,
				'transaction_id' : res.transaction_id
			}

			fetch(`apiUrl/checkout/`, {
				method: 'post',
				headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}`},
				body: JSON.stringify({
					receipt,
				})
			})
		}
	}

	function canCheckout(){
		return true
	}

	
	const flutterConfig = {
		public_key: `${flutterwaveApiKey}`,
		tx_ref: Date.now(),
		amount: Number(totalAmount),
		currency: 'NGN',
		customer: {
			email: user?.user?.email,
			phone: user?.phone,
			name: user?.user?.first_name + ' ' + user?.user?.last_name
		},
		customizations: {
			title: `Place your order!`,
			description: `${restaurant.name}`,
			logo: restaurant?.logo
		},
		meta: {
			placeId: place,
			customerId: user?.user?.email,
		}
	}
	const flutterPay = useFlutterwave(flutterConfig);

	async function initiatePayment(){
		if (!canCheckout()){
			return notify('error', 'Please fill all the required fields!')
		}

		let _total = 0

    	for (let item of cartData.items){
			_total += item.quantity * item.item.price
		}
		setTotalAmount(_total)
		
		setTimeout( () => {
			try{

				flutterPay({
					callback: (res) => {
						onPaymentResponse(res)
					},
					onClose: () => {
						onModalClose()
					}
				})
			}catch(err){
				notify('error', err.message, 40000)
			}
		}, 2000)
	}

	
	async function getCartData(){
		let res, data;

		try{
			res = await fetch(`${apiUrl}/cart/?place=${place}`, {
				headers: {'Authorization': `Token ${token}`}
			});			
			data = await res.json()

			if (res.ok){
				setCartData(data.cart)
				notify('success', 'Got data')
			}else{
				notify('error', (data.message || 'Something went wrong!'))
			}
		}catch(err){
			notify('error', err.message)
			console.log('error', err)
		}
	}

	useEffect(() => {
		async function init(){
			await getCartData();	
			setTimeout(() => setLoadingState(false), 2100);
		}
		init();

		setTimeout(() => setPaymentLoadingState(false), 3500)
		
	}, [])

	if (loading){
		return(
			<Page>
				<DashboardLoader loading={loading} />
			</Page>
		)
	}

	return(
		<Page sx={{maxWidth: 1000, mx:'auto', py: 5}}>
			<Box className="titlebar" sx={{my: 2}}>
				<Typography className="title"> Checkout </Typography>
			</Box>

			<Box>
				<OrderList orders={cartData.items} removable={false} />

				<Box sx={{mx: 'auto', textAlign: 'center'}}>
				    <StyledButton
				      disabled={loadingPayment}
				     onClick={initiatePayment} 
				     sx={{my: 3, mx: 'auto', fontWeight: 600, px: 3, py: 2, fontSize: '15px'}} 
				     variant="warning"
				     icon={loadingPayment ? <CircularProgress indeterminate /> : <LocalDelivery />}
				    > <Typography sx={{ ml: 1, fontWeight: 600}}> Place your Order! </Typography> </StyledButton>
				</Box>
			</Box>
			
		</Page>
	)
}


export default StoreHomePage;
