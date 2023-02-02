import React, {Fragment, useEffect, useState, useContext} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/Stars';
import LocalDelivery from '@mui/icons-material/LocalShipping';
import Typography from '@mui/material/Typography';
import {useParams} from 'react-router-dom';
import GlobalStore from '../../helpers/store';
import {DashboardLoader} from '../../components/loaders';
import {Page, ProductCard, BackButton, StyledButton as Button} from '../../components/index';


export const ItemDetailPage = ({ place, ...props }) => {
	const { apiUrl, getUserData, theme, notify} = useContext(GlobalStore);
	const [item, setItemData] = useState(null);
	const [relatedItems, setRelatedItems] = useState(null);
	const [cartQty, setCartQty] = useState(1);
	const [loading, setLoadingState] = useState(true);
	const { user, token } = getUserData();
    const {itemId} = useParams()

	async function addToCart(){
		let res, data;

		res = await fetch(`${apiUrl}/cart/?place=${place}`, {
			method: 'post',
			headers: {'Authorization': `Token ${token}`, 'Content-Type': 'application/json'},
			body: JSON.stringify({
				action: 'add-to-cart',
				item: item.slug,
				qty: cartQty,
			})
		});

		data = await res.json();
		if (res.ok){
			notify('success', "Item added to cart")
		}else{
			notify('error', data.message)
		}
	}



	async function getData(){
		let res, data;

		try{
			res = await fetch(`${apiUrl}/menu/item/?place=${place}&itemId=${itemId}`);
			item = await res.json()
			if (res.ok){
				setItemData(data.item)
				setRelatedItems(data.related_items)
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
	}, [itemId])

	if (loading){
		return(
			<Page>
				<DashboardLoader loading={loading} />
			</Page>
		)
	}

	return(
		<Page>
			<Box className="" sx={{maxWidth: 1000, mx:'auto', pt: 3}}>
            <BackButton path={`/${place}/menu/`} />
			
			<Box className="" sx={{my: 4, py: 3, borderRadius: 1, backgroundColor: '#fff'}}>
                <Box>
                    <Box className="row" sx={{alignItems: 'center !important' }}>
                        <Box className="col-sm-6 col-md-5 col-lg-4" sx={{px: 0, pb: 3}}>
                            <Box sx={{maxWidth: '450px', p: 1.5}}>
                                <img src={item.image} style={{width: '100%', borderRadius: '5px'}} />
                            </Box>
                        </Box>

                        <Box className="col-sm-6 col-md-6 col-lg-7">
				          <Box sx={{px: 2, py: 2}}>
				            <Typography 
				                sx={{
				                	 fontSize: 25,
				                	 fontWeight: 600,
				                	}}
				                className="title"
				            > {item?.name} </Typography>

				            <Typography 
				                sx={{
				                	 fontSize: 17.5,
				                	 fontWeight: 600,
				                	 my: 1,
				                	}}
				                className="title"
				            > ${item?.price} </Typography>

				            <Typography 
				                sx={{
				                	 fontSize: 17,
				                	 my: 2
				                	}}
				                className=""
				            > {item?.about} </Typography>
                            
                             <Typography 
				                sx={{
				                	 fontSize: 17,
				                	 my: 2,
				                	 fontWeight: 600,
				                	 opacity: .7
				                	}}
				                className=""
				            > Category: {item?.category} </Typography>


				            <Box>
                                <input style={{
                                	width: 80, marginRight: 10,
                                	display: 'inline-flex'
                                 }} 
                                 className="input" 
                                 type="number" 
                                 value={cartQty}
                                 onInput={e => setCartQty(e.target.value)}
                                 min="1" 
                                 required 
                                />

                                <Button variant="warning" onClick={addToCart}> <Typography> Add to Cart </Typography> </Button>
				            </Box>
                        </Box>
                      </Box>
                    </Box>

                </Box>
			</Box>

			<Box sx={{ my: 3}}>
				            <Typography 
				                sx={{
				                	 fontSize: 22,
				                	 fontWeight: 600,
				                	 textAlign: 'center'
				                	}}
				                className="title"
				            > Related Items </Typography>
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
				relatedItems?.map(item => (
					<ProductCard key={item.id} item={item} />
				))
			}
			</Grid>
			</Box>
		</Page>
	)
}


export default ItemDetailPage;
