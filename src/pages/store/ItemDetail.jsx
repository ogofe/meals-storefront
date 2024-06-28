import React, {Fragment, useEffect, useState, useContext} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/Stars';
import CartIcon from '@mui/icons-material/AddShoppingCart';
import Typography from '@mui/material/Typography';
import {useParams} from 'react-router-dom';
import GlobalStore, { RestaurantStore } from '../../helpers/store';
import {DashboardLoader} from '../../components/loaders';
import {Page, ProductCard, BackButton, StyledButton as Button} from '../../components/index';
import {normalizeDigits} from '../../utils'
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Badge, Card, Chip, Input, Radio, RadioGroup, Stack } from '@mui/material';
import { ArrowDownward } from '@mui/icons-material';


export const ItemDetailPage = ({ place, ...props }) => {
	const { getUserData, notify} = useContext(GlobalStore);
	const { axios, } = useContext(RestaurantStore);
	const [item, setItemData] = useState(null);
	const [relatedItems, setRelatedItems] = useState(null);
	const [customizations, setCustomizations] = useState({});
	const [cartQty, setCartQty] = useState(1);
	const [loading, setLoadingState] = useState(true);
	const { user, token } = getUserData();
    const {itemId} = useParams()

	async function addToCart(){
		const payload = JSON.stringify({
			action: 'add-to-cart',
			item: item.slug,
			qty: cartQty,
		})
		const res = await axios.post(`/cart/`, payload)
		if (res.status === 200){
			notify('success', "Item added to cart")
		}else{
			notify('error', res.data.message)
		}
	}

	// let custom = {
	// 	'meat type': 'Beef',
	// 	''
	// }

	function changeCustomization({ name, choice }){
		setCustomizations({
			...customizations,
			...{name : choice}
		})
	}

	async function getData(){
		let res, data;

		try{
			res = await axios.get(`/menu/item/?itemId=${itemId}`);
			data = await res.data

			console.log("ITEM,", data)

			if (res.status === 200){
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
			<Box className="" sx={{maxWidth: 1000, mx:'auto'}}>
            <BackButton path={`/menu/`} />
			
			<Box className="" sx={{ py: 3, backgroundColor: '#fff'}}>
                <Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4} lg={4} sx={{px: 0, pb: 1.5}}>
                            <Box>
								<Box sx={{maxWidth: '450px'}}>
									<img alt={`${item?.name}`} src={item.image.url} style={{width: '100%', borderRadius: '5px'}} />
								</Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={8} lg={8}>
							<Box>
								<Typography 
									sx={{
										fontSize: 25,
										fontWeight: 600,
										}}
									className="title"
								> {item?.name} </Typography>

								<Box className='d-flex' my={2} alignItems={'center'} justifyContent={'safe start'}>
									<Typography 
										sx={{
											fontSize: 17.5,
											fontWeight: 600,
											my: 1, mr: 3
											}}
										className="title"
									> ${normalizeDigits(item?.price)} </Typography>
									<Chip px={4} py={2} color='success' label={item?.category} />
								</Box>
							</Box>

							<Typography 
								className="item-description"
								dangerouslySetInnerHTML={{ __html: item?.about || "No description for this item"}}
							/>
                        </Grid>
                    </Grid>

					{
						item?.custom_choices?.length > 0 && 
						<Box sx={{ fontSize: 17, my: 2, borderRadius: 1.5, }}>

							<Grid container gap={2} overflowX={'auto'} py={3}>
							{
								item?.custom_choices?.map(({ name, choices, required, default_choice}, idx) => 
									<Grid  my={1.2} borderBottom={'1px solid gray'} py={2} key={idx} item xs={12} sm={5} md={4}>
										
										<Grid container>
											<Typography mb={2} fontWeight={'600'}> {name} </Typography>
											{required && <Chip label={"Required"} />}
										</Grid>

										<Stack>
											{choices.map((choice, idx) => 
												<RadioGroup name={name}>
													<Box className='d-flex' alignItems={'center'} gap={1} mb={0.5}>
														<Radio
															sx={{height:'20px', width: '20px' }}
															name={name}
															size='small'
															value={choice.name}
															onChange={e => changeCustomization({ name: name, choice: choice.name})}
														/>
														<Typography className='d-flex' flex={1} key={idx}>
															<span>{choice.name}</span> 
															<span>{choice.price > 0 ? `+${normalizeDigits(choice?.price)}` : 'Free'}</span>
														</Typography>
													</Box>
												</RadioGroup>
											)}
										</Stack>
									</Grid>
								)
							}
							</Grid>
						</Box>
					}


					<Grid container gap={2}>
						<Grid item xs={12} sm={5} md={6}>
							<Input disableUnderline
								sx={{
									py: 0.5,
									px: 2,
									width: '100%',
									marginRight: 5,
									maxWidth: 400,
									display: 'inline-flex'
								}}
								className="input" 
								type="number"
								unselectable 
								value={cartQty}
								onInput={e => setCartQty(e.target.value)}
								required
								min={1}
							/>
						</Grid>						

						<Grid item xs={12} sm={5} md={6}>
							<Button variant="warning" sx={{ width: '100%'}} icon={<CartIcon sx={{mr: 1,}} />} onClick={addToCart}> <Typography> Add to Cart </Typography> </Button>
						</Grid>
					</Grid>
					

                </Box>
			</Box>

			{
				relatedItems?.length > 0 &&
				<Fragment>
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
				</Fragment>
			}
			</Box>
		</Page>
	)
}


export default ItemDetailPage;
