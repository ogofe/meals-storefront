import React, {useEffect, useState, useContext} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import {useParams} from 'react-router-dom';
import GlobalStore, {RestaurantStore} from '../../helpers/store';
import {MenuLoader} from '../../components/loaders';
import {Page, ProductCard, CategoryPill, TabNavigation, MenuHeader} from '../../components/index';
import { IconButton, Stack, useMediaQuery } from '@mui/material';
import { ListAlt } from '@mui/icons-material';


export const 	StoreHomePage = ({ place, ...props }) => {
	const {notify, getUserData} = useContext(GlobalStore);
	const [data, setData] = useState(null);
	const [menu, setMenu] = useState(null);
	const {restaurant, axios} = useContext(RestaurantStore);
	const [loading, setLoadingState] = useState(true);
	const [links, setLinks] = useState([]);
	const [selectedCategory, setCategory] = useState("");
	const [processing, setProcessingState] = useState(true);
	const isMoblieDevice =  useMediaQuery('(max-width: 385px)');

	async function getData(cat){
		let params;
		if (cat){
			params = {
				cat:cat
			}
		}

		try{
			const res = await axios.get('/menu/', {
				params
			});
			
			if (res.status === 200){
				setData(res.data.data)
				setMenu(res.data.data.products)
				// notify('success', 'Got data')
			}else{
				notify('error', 'Something went wrong!')
			}
			setTimeout(() => setLoadingState(false), 1200);
		}catch(err){
			notify('error', err.message)
			setTimeout(() => setLoadingState(false), 1200);
		}
	}

	function filterMenu(cat){		
		let _filtered = Array.from(data.products)
		_filtered = _filtered.filter(( item ) => item.category === cat)
		setMenu(_filtered)
	}
	
	async function changeCategory(_cat){
		if (_cat === ""){
			await setCategory(_cat);
			return setMenu(data.products)
		}

		if (_cat){
			await setCategory(_cat);
			return filterMenu(_cat)
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
			<Page sx={{ maxWidth: 1000, mx: 'auto' }}>
				<MenuLoader loading={loading} />
			</Page>
		)
	}

	return(
		<Page sx={{ px: '0px !important', pt: "0px !important", pb: 5}}>

			{ loading && <CircularProgress
					color="orangered"
					indeterminate
				/>
			}
			<MenuHeader />

			<Grid container wrap='nowrap' className="titlebar" sx={{px: 0, bgcolor: '#efefef'}}>
				<IconButton disableRipple sx={{textAlign: 'left'}} className="title"><ListAlt /> </IconButton>

				<Grid flex={1} container justifyContent={'flex-start'} flexWrap={'nowrap'} className="d-flex hide-scrollbar" sx={{ alignItems: 'center', overflowX: 'auto'}}>
					<CategoryPill
						onClick={() => changeCategory("")}
						label={"All Items"}
						active={selectedCategory === ""}
					/>

					{
						data?.categories?.map(cat => (
							<CategoryPill
							active={cat.name === selectedCategory}
							onClick={() => changeCategory(cat.name)}
							label={cat.name}
							/>
						))
					}
				</Grid>
			</Grid>

			<Stack sx={{px: 2 }}>
				<Box className="titlebar" sx={{mt: 4,}}>
					<Typography sx={{ textAlign: 'center'}} className="title"> {selectedCategory ? selectedCategory : "Our Menu" } </Typography>
				</Box>
				
				<Grid
					container wrap="wrap"
					spacing={2}
					justifyContent={'space-between'}
					sx={{
						alignItems: isMoblieDevice ? 'center' : 'center',
						py: 3
					}}
				>
				{
					menu?.map(item => (
						<Grid item xs={12} sm={12} md={6} lg={4} justifyContent={'center'} display={'flex'}>
							<ProductCard key={item.id} item={item} />
						</Grid>
					))
				}
				</Grid>
			</Stack>

		</Page>
	)
}


export default StoreHomePage;

