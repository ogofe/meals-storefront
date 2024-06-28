
import { Box, Grid, Typography } from '@mui/material';
import { BackButton, OrderList, Page, StyledBadge } from '../../components';
import { useContext, useEffect, useState } from 'react';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import GlobalStore from '../../helpers/store';
import { useParams } from 'react-router-dom';
import {DashboardLoader} from '../../components/loaders';

export const OrderDetailPage = ({ place, ...props }) => {
    const {orderId} = useParams()
    const [order, setData] = useState(null);
    const [loading, setLoadingState] = useState(true);
    const {notify, getUserData, apiUrl} = useContext(GlobalStore)
    const {token} = getUserData()

    async function getData(){
        try {
            const res = await fetch(`${apiUrl}/me/orders/item/?place=${place}&orderId=${orderId}`, {
                headers: { "Authorization": `Token ${token}`}
            });
    
            const data = await res.json();
            console.log("Got Data:", data)
            setData(data.order)
            notify('success', "Got Data")
             
        } catch (error) {
            notify('error', "Something went wrong!")
            console.log("Error:", error)
        }
    }

    useEffect(() => {
        getData()
        setTimeout(() => setLoadingState(false), 2000)
    }, [])

    if (loading){
        return(
            <Box>
                <DashboardLoader />
            </Box>
        )
    }

    return(
        <Page sx={{maxWidth: 1000, mx: 'auto',}}>
            <BackButton path={`/${place}/me/orders`} />

            <Box sx={{mt: 4}}>
                <Grid display={'flex'} alignItems={"center"} justifyContent={'space-between'}>
                    <Typography sx={{fontSize: '22px', opacity: .8}} className='bold'> Order: #{order?.order_id} </Typography>
                    <StyledBadge bg={order.status}> {order?.status.toLocaleUpperCase()} </StyledBadge>
                </Grid>
            </Box>

            <Box sx={{mt: 4}}>
                <Grid display={'flex'} alignItems={"center"} justifyContent={'space-between'}>
                    <Grid display={'flex'} alignItems={"center"} justifyContent={'space-between'}>
                        <CalendarIcon />
                        <Typography sx={{}} className='bold'> Created: {order?.created_on} </Typography>
                    </Grid>
                    {/* <StyledBadge bg={order.status}> {order?.status.toLocaleUpperCase()} </StyledBadge> */}
                </Grid>
            </Box>

            <Box sx={{mt: 3}}>
                <OrderList removable={false} orders={order?.items} />
            </Box>
        </Page>
    )
}


export default OrderDetailPage;