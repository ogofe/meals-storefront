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

export const CheckoutPage = ({ ...props }) => {
	const {getUserData, apiUrl, theme, notify, flutterwaveApiKey} = useContext(GlobalStore);
	const {restaurant, place} = useContext(RestaurantStore);
	const [cartData, setCartData] = useState(null);
	const [fees, setFees] = useState([]);
	const [loading, setLoadingState] = useState(true);
	const [paymentPayload, setPaymentPayload] = useState(null);
	const [paymentResponse, setPaymentResponse] = useState(null);
	const { user, token } = getUserData();
	const navigate = useNavigate();
	const [totalAmount, setTotalAmount] = useState(0);
	const [flutterPortal, setFlutterPortal] = useState(null);

	async function onModalClose(){
		if (paymentResponse){
			if (paymentResponse.status === 'successful'){
				notify('success', "Your order has been placed!")
			}else{
				notify('success', "Something went wrong when placing your order!")
			}
			return setTimeout(() =>
				navigate(`/${place}/menu/`),
				// navigate(`/${place}/checkout/complete/?status=${paymentResponse.status}&rdr_next=&req_rvw=true`),
				3500
			)
		}
		return notify('error', "You canceled your order!")
	}

	async function onPaymentResponse(res){
		setPaymentResponse(res)
		if (res.status === 'successful'){
			const receipt = {
				'flutter_ref' : res.flw_ref,
				'transaction_id' : res.transaction_id
			}

			fetch(`${apiUrl}/checkout/?place=${place}`, {
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

	
	async function getOrderData(){
		let res, data;

		try{
			res = await fetch(`${apiUrl}/checkout/?place=${place}`, {
				headers: {'Authorization': `Token ${token}`}
			});			
			data = await res.json()

			if (res.ok){
				setCartData(data.items)
				setFees(data.fees)
				setTotalAmount(data.total)
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
			await getOrderData();	
		}
		init();

		setTimeout(() => setLoadingState(false), 3700);
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
				<OrderList orders={cartData} removable={false} />

				<Box sx={{mx: 'auto', textAlign: 'center'}}>
				    <OrderButton
				    	canCheckout={canCheckout()}
				    	flutterwaveApiKey={flutterwaveApiKey}
				    	notify={notify}
				    	place={place}
				    	restaurant={restaurant}
				    	totalAmount={totalAmount}
				    	user={user}
				    	token={token}
				    	order={cartData}
				    	onModalClose={onModalClose}
				    	onPaymentResponse={onPaymentResponse}
				    />
				</Box>
			</Box>
			
		</Page>
	)
}



const OrderButton = ({ user, canCheckout, notify, ...props }) => {

	function makePayload(){
		let payload = {
			public_key: `${props.flutterwaveApiKey}`,
			tx_ref: Date.now(),
			amount: props.totalAmount,
			currency: 'NGN',
			customer: {
				email: user?.user?.email,
				phone: user?.phone,
				name: user?.user?.first_name + ' ' + user?.user?.last_name
			},
			customizations: {
				title: `${props.restaurant.name}`,
				description: `${props.restaurant.name}`,
				logo: props.restaurant?.logo
			},
			meta: {
				placeId: props.place,
				customerId: user?.user?.email,
			}
		}
		return payload;
	}
	
	const flutterPay = useFlutterwave(makePayload());

	async function initiatePayment(){
		if (!canCheckout) {
			return notify('error', 'Please fill all the required fields!')
		}
		
		try{
			flutterPay({
				callback: (res) => {
					props.onPaymentResponse(res)
				},
				onClose: () => {
					props.onModalClose()
				}
			})
		}catch(err){
			notify('error', err.message, 4000)
		}
	}

	const [loadingPayment, setPaymentLoadingState] = useState(true);
	setTimeout(() => setPaymentLoadingState(false), 4500)

	return (
		<StyledButton
	     disabled={loadingPayment}
	     onClick={initiatePayment} 
	     sx={{my: 3, mx: 'auto', fontWeight: 600, px: 3, py: 2, fontSize: '15px'}} 
	     variant="warning"
	     icon={loadingPayment ? <CircularProgress indeterminate /> : <LocalDelivery />}
	    > <Typography sx={{ ml: 1, fontWeight: 600}}> Place your Order! </Typography> </StyledButton>
	)
}

export default CheckoutPage;
