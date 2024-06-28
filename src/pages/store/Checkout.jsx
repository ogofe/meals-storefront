import React, {Fragment, useEffect, useState, useContext} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import DeliveryIcon from '@mui/icons-material/LocalShipping';
import LocalDelivery from '@mui/icons-material/LocalShipping';
import PickupIcon from '@mui/icons-material/Fastfood';
import Typography from '@mui/material/Typography';
import {useFlutterwave, closePaymentModal} from 'flutterwave-react-v3'; // install first!
import GlobalStore, {RestaurantStore} from '../../helpers/store';
import {DashboardLoader} from '../../components/loaders';
import {Page, StyledButton, OrderList, BackButton} from '../../components/index';
import { useNavigate } from 'react-router-dom';
import {
	FormGroup,
	IconButton,
	TextField, useMediaQuery,
} from '@mui/material';


const {onLine} = window.navigator;
// const {onLine} = {onLine: false};

export const CheckoutPage = ({ ...props }) => {
	const {getUserData, apiUrl, theme, notify, flutterwaveApiKey} = useContext(GlobalStore);
	const {restaurant, place} = useContext(RestaurantStore);
	const [cartData, setCartData] = useState(null);
	const [delivery, setDelivery] = useState(false);
	const [loading, setLoadingState] = useState(true);
	const [paymentResponse, setPaymentResponse] = useState(null);
	const { user, token } = getUserData();
	const navigate = useNavigate();
	const [totalAmount, setTotalAmount] = useState(0);

	async function onModalClose(){
		if (paymentResponse){
			if (paymentResponse.status === 'successful'){
				notify('success', "Your order has been placed!")
			}else{
				notify('success', "Something went wrong when placing your order!")
			}
			return setTimeout(() =>
				navigate(`/${place}/checkout/complete/?status=${paymentResponse.status}&rdr_next=&req_rvw=true`),
				2500
			)
		}else{
			// user canceled the order? 
			notify('error', "You canceled your order!")
			return setTimeout(() =>
			navigate(`/${place}/cart/`),
			500
		) 
		}
	}

	async function onPaymentResponse(res){
		setPaymentResponse(res)
		console.log("PAyment Response:", res)

		if (res.status === 'successful'){
			const receipt = {
				'flutter_ref' : res.tx_ref,
				'transaction_id' : res.transaction_id
			}

			fetch(`${apiUrl}/checkout/?place=${place}`, {
				method: 'post',
				headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}`},
				body: JSON.stringify({
					receipt,
				})
			})

			closePaymentModal()
		}
	}

	function canCheckout(){
		return true
	}

	function initiateCheckout(){
		if (canCheckout()){

		}
	}

	async function getOrderData(){
		let res, data;

		try{
			res = await fetch(`${apiUrl}/checkout/?place=${place}`, {
				headers: {'Authorization': `Token ${token}`}
			});			
			data = await res.json()

			if (res.ok){
				console.log("DATA:", res.data)
				setCartData(data.items)
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

	const isDesktop = useMediaQuery('(min-width: 1000px)')

	if (loading){
		return(
			<Page>
				<DashboardLoader loading={loading} />
			</Page>
		)
	}

	return(
		<Page sx={{maxWidth: 1000, mx:'auto', py: 5,}}>

			<Box className="titlebar" sx={{mt: 2, mb: 5}}>
				<BackButton path={`/menu`} />
				<Typography sx={{mt: 3, fontSize: 25, opacity: .7}} className="bold"> Checkout </Typography>
			</Box>

			<Box>
				<Grid container justifyContent={'space-between'} spacing={"10px"}>
					<Grid item xs={12} md={6} lg={6} sx={{background: '#b9b9b912', borderRadius: '20px 20px 0px 0px', p: 2, pb: 4}}>
						<Box>
							<Typography className='bold' sx={{mb: 3, textAlign: 'center', opacity: .6, fontSize: 23}}> Order Form </Typography>

							<FormGroup sx={{mt: 4}}>
								<TextField type='text' name='name' label={"Customer's Name"}></TextField>
							</FormGroup>

							<FormGroup sx={{mt: 4}}>
								<TextField type='email' name='email' label={"Customer's Email"}></TextField>
							</FormGroup>

							<FormGroup sx={{mt: 4}}>
								<TextField type='tel' name='phoneNumber' label={"Customer's Phone number"}></TextField>
							</FormGroup>

							<FormGroup sx={{ mt: 4 }}>
								<Grid container placeholder='Delivery Type' sx={{justifyContent: 'space-between'}}>
									<Grid item xs={6}>
										<FormGroup sx={{mx:2, textAlign: 'center', width: 120}}>
											<IconButton onClick={() => setDelivery(true)} color={delivery ? 'primary' : 'default'}
												checked={delivery}
												sx={{borderRadius: 30}}
											>
												<DeliveryIcon />
												<Typography className='bold' sx={{ml: 2}}> Delivery </Typography>
											</IconButton>
										</FormGroup>
									</Grid>


									<Grid item xs={6}>
										<FormGroup sx={{mx:2, textAlign: 'center', width: 120}}>
											<IconButton onClick={() => setDelivery(false)} color={!delivery ? 'error' : 'default'}
												checked={!delivery}
												sx={{borderRadius: 30 }}
											>
												<PickupIcon />
												<Typography className='bold' sx={{ml: 2}}> Pickup </Typography>
											</IconButton>
										</FormGroup>
									</Grid>
								</Grid>
							</FormGroup>

							{
								delivery ?
								<FormGroup sx={{mt: 4}}>
									<TextField type='search' name='location' label={'Delivery Location'}></TextField>
								</FormGroup>
								:
								<FormGroup sx={{mt: 4}}>
									<TextField type='time' format="12" pattern='12' label={'Time of Pickup'}></TextField>
								</FormGroup>
							}


							<FormGroup sx={{mt: 4}}>
								<TextField type='text' name='notes' multiline label={'Additional Notes'}></TextField>
							</FormGroup>
						
							<Box sx={{textAlign: 'center', width: '100%'}}>
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
					</Grid>

					<Grid item xs={12} md={6} lg={5}>
						<Box fullwidth>
							<OrderList orders={cartData} removable={false} />
						</Box>
					</Grid>

				</Grid>
			</Box>
		</Page>
	)
}



const OrderButton = ({ user, notify, ...props }) => {
	const [canCheckout, setCheckoutAbility] = useState(false)
	const [flutterPay, setFlutterPayObject] = useState(null)

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
				logo: props.restaurant?.logo_url
			},
			meta: {
				placeId: props.place,
				customerId: user?.user?.email,
			}
		}
		return payload;
	}

	const _flutterPay = {}
	// const _flutterPay = useFlutterwave(makePayload());
	// setFlutterPayObject(_flutterPay)
	
	useEffect(() => {
		// if (window.navigator.onLine){
		// 	setCheckoutAbility(true)
		// }else{
		// 	const checkoutInterval = setInterval(
		// 		function(){
		// 		if (window.navigator.onLine){
		// 			clearInterval(checkoutInterval);
		// 			setCheckoutAbility(true)
		// 		}
		// 	}, 2000)
		// }

		// setCheckoutAbility(true)
	}, [])
	
	async function initiatePayment(){
		if (!canCheckout) {
			return notify('error', 'Please fill all the required fields!')
		}
		
		try{
			_flutterPay({
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

	// setTimeout(() => setPaymentLoadingState(false), 4500)

	// if (!canCheckout){
		return (
			<StyledButton sx={{mt: 3, px: 3, py: 2.25}} variant='warning'>
				<Typography className='bold'> Place Your Order </Typography>
			</StyledButton>
		)
	// }

	// return (
	// 	<StyledButton
	//      disabled={loadingPayment}
	//      onClick={initiatePayment} 
	//      sx={{my: 3, mx: 'auto', fontWeight: 600, px: 3, py: 2, fontSize: '15px'}} 
	//      variant="warning"
	//      icon={
	// 		loadingPayment ? <CircularProgress indeterminate size={15} sx={{
	// 			mr: 2, color: 'orange'
	// 		}} /> : <LocalDelivery />
	// 	}
	//     > <Typography sx={{ ml: 1, fontWeight: 600}}> Place your Order </Typography> </StyledButton>
	// )
}

export default CheckoutPage;
