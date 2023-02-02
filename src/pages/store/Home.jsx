import React, {useEffect, useState, useContext} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useNavigate} from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Storefront'
import GlobalStore, {RestaurantStore} from '../../helpers/store';
import {DashboardLoader} from '../../components/loaders';
import {Page, ProductCard, StyledButton, Separator} from '../../components/index';

const {Notification} = window;

export const StoreHomePage = ({ place, ...props }) => {
	const {token, apiUrl, notify} = useContext(GlobalStore);
	const {restaurant} = useContext(RestaurantStore);
	const [data, setData] = useState(null);
	const [loading, setLoadingState] = useState(true);
	const navigate = useNavigate();
	const isMobile = useMediaQuery('(max-width: 768px)');


	async function getData(){
		let res, info;

		try{
			res = await fetch(`${apiUrl}/menu/?place=${place}`);
			info = await res.json()
			if (res.ok){
				setData(info.data)
				notify('success', 'Got data')
			}else{
				notify('error', 'Something went wrong!')
			}
			setTimeout(() => setLoadingState(false), 1200);
		}catch(err){
			notify('error', err.message)
			setTimeout(() => setLoadingState(false), 1200);
		}
	}

	useEffect(() => {
		async function init(){
			await getData();
			Notification.requestPermission()
			.then(allowNotify => {
				if (allowNotify === 'granted'){
				    new Notification("Shago Meals", {
					    body: 'Thanks for allowing notifications'
				    })
			    }else{
				    notify('error', "Please allow notifications to use this site", 5000)
			    }
			})
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
		<Page sx={{ p: '0 !important' }}>

			<Box sx={{
				px: 3,
				py: '4rem',
		              display: 'flex',
		              justifyContent: 'flex-end',
		              flexDirection: 'row-reverse',
		              alignItems: 'center',
		              background: 'linear-gradient(131deg, sandybrown, orange)',
		              flexWrap: 'wrap-reverse',
		              }}
	              >
	    			<Typography sx={{
		                    fontSize: "25px",
		                    fontWeight: '600',
		                    fontFamily: "Sans",
		                    padding: 2,
		                    textAlign: 'center',
		                    flexGrow: 1,
		              }}> {restaurant?.name} </Typography>

				<Box sx={{
					width: 200,
					height: 200,
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

			{/*-- Banner --*/}
			<Box style={{
				width: '100%',
				height: isMobile ? '350px' : '600px',
				mb: '4rem',
				backgroundImage: `url(${restaurant?.banner})`,
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
				}}
			></Box>
			{/*-- Banner --*/}
			
			{/*-- About Us --*/}
			<Box className="" sx={{ my: 3, px: 3, py: 5, maxWidth: 1000, mx: 'auto' }}>
				<Typography sx={{
					my: 3, opacity: .8, textAlign: 'center',
					fontWeight: 600, fontSize: 23,
				 	}} 
				 	className="title"
				> About Us  </Typography>

		              <Box
		               sx={{
		               	fontSize: 20,
		               	textAlignLast: 'center',

		               }}
		               dangerouslySetInnerHTML={{__html: restaurant?.about}}

		              ></Box>
			</Box>
			{/*-- About Us --*/}

			{/*-- Featured items --*/}
			<Box sx={{py: 5, maxWidth: 1000, mx: 'auto'}}>
				<Typography sx={{
					my: 3, opacity: .8,
					textAlign: 'center', fontWeight: 600,
					fontSize: 23}} className="title"
				> Featured Items 
				</Typography>

				<Grid

					 container
					 wrap="wrap"
					 className="d-flex"
					 sx={{ 
				        justifyContent: 'space-around',
				        alignItems: 'flex-start',
				        pb: 2,
				        mt: 4,
				    }}
				>
					{
						data?.products?.slice(0, 6).map(item => (
							<ProductCard key={item.id} item={item} />
						))
					}
				</Grid>

				<Box sx={{mx: 'auto', textAlign: 'center'}}>
				    <StyledButton
				     onClick={() => navigate(`/${place}/menu/`)} 
				     sx={{my: 3, mx: 'auto', fontWeight: 600, px: 3, py: 2, fontSize: '15px'}} 
				     variant="warning"
				     icon={<MenuIcon />}
				    > <Typography sx={{ ml: 1, fontWeight: 600}}> Browse our Menu </Typography> </StyledButton>
				</Box>
			</Box>
			{/*-- Featured items --*/}


			{/*-- Location and Contact --*/}
			<Box className="" sx={{ my: 5, p: 3, maxWidth: 1000, mx: 'auto'}}>
				<Typography sx={{my: 3, textAlign: 'center', opacity: .8, fontWeight: 600, fontSize: 23}} className="title"> Where To Find Us  </Typography>

		                 <Typography style={{
		                 	my: 2,
		                 	fontSize: 18
		                 }}>
		                 
		              </Typography>
			</Box>
			{/*-- Location and Contact --*/}

			{/*<Separator />*/}

			{/*-- Footer --*/}
			<Box className="" sx={{ 
				mt: 5, px: 3, py: '4rem',
				borderTop: '3px dashed grey',
				background: 'linear-gradient(131deg, sandybrown, orange)',
			 }}>
				<Typography sx={{my: 1.3, opacity: .8, fontWeight: 600, fontSize: 23}}> {restaurant?.name}  </Typography>

		              <Typography style={{
		                 	my: .25,
		                 	fontSize: 15,
		                 	maxWidth: 400,
		              }}>
		                 We are the best restaruant in Nigeria with all you can eat.
		                 Here's some generic info about us. This info is default to all new stores on Shago!
		              </Typography>
			</Box>
			{/*-- Footer --*/}


		</Page>
	)
}


export default StoreHomePage;
