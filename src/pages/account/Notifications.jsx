import {useEffect, useState, useRef, useContext} from 'react';
import {Page, StyledButton} from '../../components/index';
import {GlobalStore} from '../../App.jsx';
import {Typography, Box, Button, Select} from '@mui/material';

export const NotificationPage = ({ props }) =>{
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoadingState] = useState(true);
    const {axios, notify} = useContext(GlobalStore);


    async function getData(){
        // axios fetch data from server
        const res = axios.get(`/notifications/`);
        
        if(res.status === 200){
            notify('success', "Got data")
        }else{
            notify('error', "Something went wrong")
        }
    }

    async function init(){
        try {
            getData()
            // after get data set loading state to false
            // if data
        } catch (error) {
            
        }finally{
            setTimeout(
                () => setLoadingState(false),
                2000
            )
        }
    }

    useEffect(() => {
        init()
    
    }, [])
    
    if (loading){
        return null
    }

    return(
        <Page className="container">

        {
            notifications ? notifications.map((notification, idx) => 
                <Box key={idx}>
                    
                </Box>
            ) : (
                <Typography> There are no notifications to show! </Typography>
            )
        }

        </Page>
    )
}

export default NotificationPage;