import React, {Fragment, useEffect, useState, useContext} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import RightIcon from '@mui/icons-material/ChevronRight';
import LeftIcon from '@mui/icons-material/ChevronLeft';
import Typography from '@mui/material/Typography';
import {useNavigate} from 'react-router-dom';
import GlobalStore, {RestaurantStore} from '../../helpers/store';
import {CartLoader} from '../../components/loaders';
import {Page, OrderList, StyledButton, OrderListItem} from '../../components/index';
import { Badge, IconButton, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';


export const CartPage = ({ ...props }) => {
	const {userProfile, apiUrl, getUserData, notify, } = useContext(GlobalStore);
	const { restaurant, place, axios, normalizeDigits} = useContext(RestaurantStore);
	const [cart, setCart] = useState(null);
	const [loading, setLoadingState] = useState(true);
	const { user, token } = getUserData();
	const navigate = useNavigate();

	

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
			init()
		  }
	  }
	async function getData(){
		let res, data;

		try{
			res = await axios.get(`/cart/`);
			data = await res.data
			
			if (res.status === 200){
				setCart(data.cart)
			}else{
				notify('error', (data.message || 'Something went wrong!'))
			}
			setTimeout(() => setLoadingState(false), 1200);
		}catch(err){
			console.log('error', err)
			notify('error', err.message)
			setTimeout(() => setLoadingState(false), 1200);
		}
	}

	async function init(){
		setLoadingState(true)
		await getData();
		// setLoadingState(false)
	}

	useEffect(() => {
		init();
	}, [])

	if (loading){
		return(
			<Page>
				<CartLoader loading={loading} />
			</Page>
		)
	}

	return(
		<Page sx={{ overflowY: 'scroll', mx: 'auto'}}>
			<Box className="titlebar d-flex" justifyContent={'space-between'} sx={{my: 3}}>
				<Typography className="title"> Your Cart </Typography>
				<Badge style={{
						padding: '0px 9px',
						background: 'orange',
						borderRadius: '30px'
				}} color='info' variant='standard'>
					<Typography sx={{color: '#fff', opacity: '1 !important'}} className="title"> {cart?.items?.length} </Typography>
				</Badge>
			</Box>

				<TableContainer sx={{ height: '350px !important'}}>
					<Table sx={{ minWidth: "700px" }}>
						<TableHead sx={{ position: 'sticky', top: '0px', bgcolor: '#fff', zIndex: 10}}>
							<TableCell sx={{ fontWeight: '600', fontSize: '16px'}}> Food </TableCell>
							<TableCell sx={{ fontWeight: '600', fontSize: '16px'}}> Qty </TableCell>
							<TableCell sx={{ fontWeight: '600', fontSize: '16px'}}> Sub Total </TableCell>
							<TableCell sx={{ fontWeight: '600', fontSize: '16px'}}> Action </TableCell>
						</TableHead>

						<TableBody>
							{
								cart?.items?.map((item, idx) => 
								<TableRow sx={{ py: '7px !important', pl: '0px !important'}} key={props?.key || null}>
									<TableCell>
										<Box className="d-flex" sx={{ alignItems: 'center', justifyContent: 'flex-start'}}>
										<Box sx={{width: '50px', height: '45px'}} >
											<img alt='' style={{ width: '100%', height: '100%', borderRadius: '10px'}} src={item?.item?.image?.url} />
										</Box>
										<Typography sx={{ ml: 1.2}}> {item?.item?.name} </Typography>
										</Box>
									</TableCell>
									<TableCell> {item.quantity} </TableCell>
									<TableCell> ₦{(String(item.total))} </TableCell>
									<TableCell sx={{ position: 'sticky', backgroundColor: '#fff', right: '0px', width: '20px'}}> <IconButton onClick={() => removeFromCart(item?.id)}> <CancelIcon sx={{color: 'orangered'}} /> </IconButton> </TableCell>
								</TableRow>
								)
							}
						</TableBody>
					</Table>
				</TableContainer>


				<StyledButton
					disabled={cart?.items?.length < 1}
					onClick={() => navigate(`/cart/checkout/`)}
					variant="warning"
					sx={{
						ml: 'auto',
						mb: 2, mt: 4,
						px: 1.3,
						py: 1.32,
						width: "100%",
					}}
				>
					<Typography sx={{fontWeight: 600}}> Checkout </Typography>
					<RightIcon />
				</StyledButton>
			
		</Page>
	)
}


export default CartPage;
