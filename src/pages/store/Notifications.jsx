import React, {Fragment, useEffect, useState, useContext} from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import {useParams} from 'react-router-dom';
import GlobalStore, {RestaurantStore} from '../../helpers/store';
import {DashboardLoader} from '../../components/loaders';
import {Page, ProductCard, CategoryPill, TabNavigation} from '../../components/index';
// import FoodIcon from 'food-icons';


export const NotificationsPage = ({ place, ...props }) => {
	const {token, apiUrl, notify} = useContext(GlobalStore);
	const [notifications, setData] = useState([]);
	const [loading, setLoadingState] = useState(true);

	async function getData(){
		let res, data, url = `${apiUrl}/notifications/?place=${place}`;

		try{
			res = await fetch(url, {
                headers: {"Authorization": `Token ${token}`}
            });
			data = await res.json()
			if (res.ok){
				setData(data.data)
			}else{
				notify('error', 'Something went wrong!')
			}
			setTimeout(() => setLoadingState(false), 1200);
		}catch(err){
			notify('error', err.message)
			// setTimeout(() => setLoadingState(false), 1200);
		}
	}

	async function deleteNotification(_cat){
		
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
		<Page sx={{ maxWidth: 1000, mx: 'auto' }}>
			<List>
                {
                    notifications?.map((alert, idx) => 
                        <ListItem className="list-item">

                        </ListItem>                        
                    )
                }
            </List>
		</Page>
	)
}


export default NotificationsPage;
