import React, {Fragment, useEffect, useState, useContext} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/Stars';
import LocalDelivery from '@mui/icons-material/LocalShipping';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import {useParams} from 'react-router-dom';
import GlobalStore, {RestaurantStore} from '../../helpers/store';
import {DashboardLoader} from '../../components/loaders';
import {Page, ProductCard, CategoryPill, TabNavigation} from '../../components/index';
// import FoodIcon from 'food-icons';


export const StoreHomePage = ({ place, ...props }) => {
	const {token, apiUrl, org, theme, notify} = useContext(GlobalStore);
	const [data, setData] = useState(null);
	const {restaurant} = useContext(RestaurantStore);
	const [loading, setLoadingState] = useState(true);
	const [links, setLinks] = useState([]);
	const [selectedCategory, setCategory] = useState("");
	const [processing, setProcessingState] = useState(true);

	async function getData(cat){
		let res, info, url = `${apiUrl}/menu/?place=${place}`;

		if (cat){
			url = `${apiUrl}/menu/?place=${place}&cat=${cat}`
		}

		try{
			res = await fetch(url);
			info = await res.json()
			if (res.ok){
				setData(info.data)
				// notify('success', 'Got data')
			}else{
				// notify('error', 'Something went wrong!')
			}
			setTimeout(() => setLoadingState(false), 1200);
		}catch(err){
			notify('error', err.message)
			setTimeout(() => setLoadingState(false), 1200);
		}
	}

	async function changeCategory(_cat){
		await notify("info", _cat)
		if (_cat === ""){
			await setCategory(_cat);
			return setTimeout(() => getData(), 300);
		}

		if (_cat){
			await setCategory(_cat);
			return setTimeout(() => getData(_cat), 300)
		}
	}

	useEffect(() => {
		async function init(){
			await getData();
			console.log('Place', restaurant)
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


			{/* processing && <CircularProgress 
					// size={'large'}
					color="orangered"
					indeterminate
				/>
			*/}


			<Box sx={{ my: 3, 
                display: 'flex',
                justifyContent: 'flex-end',
                flexDirection: 'row-reverse',
                alignItems: 'center',
             }}>
    			<Typography sx={{
                    fontSize: "20px",
                    fontWeight: 800,
                    fontFamily: "Poppins",
                    padding: 2,
                }}> {restaurant?.name} </Typography>

				<Box sx={{
					width: 100,
					height: 100,
					borderRadius: 30,
					border: '3px solid sandybrown',
					p: 0.25
				}}>
					<img src={restaurant?.logo} style={{
						borderRadius: '300px',
						width: '100%', 
						height: '100%',
					}} />
				</Box>

			</Box>


			<Box className="titlebar" sx={{my: 3, px: 3}}>
				<Typography sx={{textAlign: 'left'}} className="title"> Categories </Typography>
			</Box>

            <Grid className="d-flex" sx={{ alignItems: 'center', overflowX: 'auto', py: 2}}>
            { selectedCategory && (selectedCategory !== "") && 

                <CategoryPill
                 onClick={() => changeCategory("")}
                 label={"Main Menu"}
                 active={selectedCategory === ""}
                />
        	}

            {
            	data?.categories?.map(cat => (
                    <CategoryPill
                     active={cat.name === selectedCategory}
                     onClick={() => changeCategory(cat.name)}
                     label={cat.name}
                     active={selectedCategory === cat.name}
                    />
            	))
            }
            </Grid>

			<Box className="titlebar" sx={{my: 4, px: 3}}>
				<Typography sx={{ textAlign: 'center'}} className="title"> {selectedCategory ? selectedCategory : "Our Menu" } </Typography>
			</Box>

			
			<Grid
			    container wrap="wrap"
			    className="d-flex"
			    sx={{ 
			        justifyContent: 'space-around',
			        alignItems: 'flex-start',
			        py: 3
			    }}
			>
			{
				data?.products?.map(item => (
					<ProductCard key={item.id} item={item} />
				))
			}
			</Grid>
		</Page>
	)
}


export default StoreHomePage;
