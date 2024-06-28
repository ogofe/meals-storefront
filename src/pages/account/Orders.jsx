
import { Box, Grid, Typography, Chip } from '@mui/material';
import { OrderItem, Page, StyledButton } from '../../components';
import { useContext, useEffect, useState } from 'react';
import {NavLink} from 'react-router-dom';
import {
    CalendarMonth as CalendarIcon,
    Fastfood as MenuIcon,
    MonetizationOn as CashIcon,
} from '@mui/icons-material';
import GlobalStore, {RestaurantStore} from '../../helpers/store';
import { normalizeDigits } from '../../utils';

export const OrderListPage = ({ place }) => {
    const {apiUrl, getUserData, notify} = useContext(GlobalStore);
    const {axios,} = useContext(RestaurantStore);
	const { token } = getUserData();
    const [orders, setData] = useState([])

    async function getData(){
        try {
            const res = await axios.get(`/me/orders/`)
            const data = await res.data
            console.log("My Orders:", data)
            setData(data.orders)

            if (data.error){
                notify('error', "Something went wrong!")
            }
        } catch (error) {
            notify('error', 'Something went wrong!')
        }
    }

    useEffect(() => {
        getData()
    }, [])

    return(
        <Page sx={{ mx: 'auto'}}>
            <Box className="titlebar" sx={{my: 3}}>
				<Typography className="title"> Your Orders </Typography>
			</Box>

            <Grid
			    container
                // spacing={8}
                className="d-flex"
			    sx={{ 
			        justifyContent: 'space-between',
			        alignItems: 'center',
			    }}
			>

                {
                    orders?.map((order, idx) => 
                        <Grid item xs={12} sm={12} md={5} lg={4}>
                            <NavLink className="no-decor" to={`${order.order_id}`} style={{textDecoration: 'none'}}>
                            <Box className="card" sx={{p: 3, maxWidth: '500px'}}>
                                <Grid container className='d-flex' sx={{alignItems: 'center'}}>
                                    <Typography sx={{ fontWeight: 600}}> #{order?.order_id} </Typography>
                                    <Chip color={'primary'} label={String(order?.status).toLocaleUpperCase()} />
                                </Grid>
                                <Box sx={{ mt: 2 }}>
                                    <Typography className='d-flex' sx={{fontWeight: 600}}> <CalendarIcon /> {order?.created_on} ago </Typography>

                                    <Grid container className='d-flex' sx={{alignItems: 'center', mt: 2}}>
                                        <Typography sx={{fontWeight: 600,}} className='d-flex'> <MenuIcon sx={{mr: 2}} />  {order?.items.length} </Typography>
                                        <Typography className='d-flex' sx={{fontWeight: 600}}> <CashIcon sx={{mr: 1}} /> {normalizeDigits(String(order?.subtotal))} </Typography>
                                    </Grid>
                                </Box> 
                            </Box>
                            </NavLink>
                        </Grid>
                    )
                }
            </Grid>
        </Page>
    )
}


export default OrderListPage;