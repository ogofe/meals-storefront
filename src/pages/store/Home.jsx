import React, {useEffect, useState, useContext} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useNavigate} from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Storefront'
import GlobalStore, {RestaurantStore} from '../../helpers/store';
import {DashboardLoader} from '../../components/loaders';
import {Page, ProductCard, StyledButton } from '../../components/index';

const {Notification} = window;

export const StoreHomePage = ({ place, ...props }) => {
	const {apiUrl, notify} = useContext(GlobalStore);
	const {restaurant, axios} = useContext(RestaurantStore);
	const [data, setData] = useState(null);
	const [loading, setLoadingState] = useState(true);
	const navigate = useNavigate();
	const isMobile = useMediaQuery('(max-width: 768px)');


	async function getData(){
		try{
			const res = await axios.get(`/place/`);
			if (res.status === 200){
				setData(res.data.data)
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

			
			{/* Hero */}
			<Box style={{
				width: '100%',
				display: 'flex',
				minHeight: '100vh',
				mb: '4rem',
				backgroundImage: `url(${restaurant?.banner})`,
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
				backgroundColor: 'rgba(0, 0, 0, 0.19)',
				backgroundBlendMode: 'overlay',
				alignItems: 'center',
				}}
			>
				<Grid container alignItems={'center'} justifyContent={'space-between'} px={4}>
					<Grid item xs={12} md={6} lg={6}>

					</Grid>

					<Grid item xs={12} md={6} lg={6}>
						<Box className='d-flex' flexWrap={'wrap'} alignItems={'center'}>
							<Typography
							 flex={1}
							 sx={{
								fontSize: "25px",
								fontWeight: '600',
								fontFamily: "Sans",
								padding: 2,
								textAlign: 'center',
								color: '#fff',
								}}
							> {restaurant?.name} </Typography>
							<Box 
							display='flex'
							width={'100%'}
							justifyContent='center'
							alignItems='center'
							>
								<Box sx={{
									width: 150,
									height: 150,
									borderRadius: 30,
									border: '3px solid sandybrown',
									p: 0.25,
								}} >
									<img alt="" src={restaurant?.logo_url} style={{
										borderRadius: '300px',
										width: '100%', 
										height: '100%',
									}} />
								</Box>
							</Box>
						</Box>
					</Grid>
				</Grid>
			</Box>
			
			{/*-- About Us --*/}
			<section id='about' name="about">
				<Box className="" sx={{px: 3, py: 5, maxWidth: 1000, mx: 'auto' }}>
					<Typography sx={{
						my: 3, opacity: .8, textAlign: 'center',
						fontWeight: 600, fontSize: 23, py: 3,
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
			</section>
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
			<section id='contact' name="contact">
				<Box className="" sx={{ my: 5, p: 3, maxWidth: 1000, mx: 'auto'}}>
					<Typography sx={{my: 3, textAlign: 'center', opacity: .8, fontWeight: 600, fontSize: 23}} className="title"> Where To Find Us  </Typography>

							<Typography style={{
								my: 2,
								fontSize: 18
							}}>
							
						</Typography>
				</Box>
			</section>
			{/*-- Location and Contact --*/}

		</Page>
	)
}


export default StoreHomePage;
