
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Badge, CardActionArea, Grid, Tooltip } from '@mui/material';
import brand_img from '/assets/images/brand_logo.png';

import { ItemReadDto, Measure, WarehouseAsign } from '@/core/models';
import { saleStore } from '@/stores/saleStore';
import { ProductService } from '@/core/services';
import { useAuthStore } from '@/stores';
import { SnackbarUtility } from '@/core/utilities';
import { useState } from 'react';

type ItemCardProps = {
    item: ItemReadDto
}

// const customCard = {
//   display: 'flex',
//   flexDirection: 'column',
//   height: '100%',
//   borderRadius: "16px",
//   borderColor: '#6571ff !important',
//   border: '1px solid',
// }
// const cardContent = {
//   flexGrow: 1,
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'space-between',
//   paddingLeft: "0.5rem!important",
//   paddingRight: "0.5rem!important",
//   paddingTop: "0.5rem!important",
//   paddingBottom: "0.25rem!important"
// }

// const flexRow = {
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
// }

export default function ItemCard({ item }: ItemCardProps) {
    const addItemToCart = saleStore(state => state.addItemToCart)
    const { cartItems, dataForm } = saleStore(state => ({
        cartItems: state.cartItems,
        dataForm: state.dataForm
    }))
    const dataEstab = useAuthStore(state => state.dataEstab)
    // const [warehouses, setWarehouses] = useState<Array<WarehouseAsign>>([])

    const handleSelectItem = (item: ItemReadDto) => {
        let warehouses: Array<WarehouseAsign> = dataForm.warehouses.filter(warehouse => warehouse.codEstab_Asig === dataEstab.codEstab_Asig);

        let dataWarehouse = {} as WarehouseAsign
        if (warehouses.length > 0) {
            dataWarehouse = warehouses.find(warehouse => (warehouse.defaultBodega)) as WarehouseAsign
        } else {
            SnackbarUtility.warning('No tienes bodegas asignadas')
            return
        }

        ProductService.findForSale(item.productId, dataWarehouse.idBodega).then(response => {
            const { product, measures } = response;
            const measureData = measures.find(measure=>measure.measureId===product.measureId) as Measure;

            addItemToCart({
                index: 0,
                productId: item.productId,
                code: item.code,
                name: item.description,
                qty: 1,
                price: measureData.rates[0]?.salePrice!,
                discount: 0,
                discountTotal: 0,
                sellingPrice: measureData.rates[0]?.salePrice!,
                totalPrice: measureData.rates[0]?.salePrice!,
                s3ObjectUrl: item.s3ObjectUrl ? item.s3ObjectUrl : brand_img
            })
            console.log(product)
            console.log(measures)
        })

        console.log(item)
        // addItemToCart({

        // })
    }

    return (
        <Card sx={
            {
                display: 'flex',
                flexDirection: 'column',
                height: '200px',
                borderRadius: "16px",
                borderColor: cartItems.some(cartItem => cartItem.code === item.code) ? '#6571ff !important' : '',

                border: cartItems.some(cartItem => cartItem.code === item.code) ? '1px solid' : '',
            }
        }>
            <CardActionArea onClick={() => handleSelectItem(item)}>
                <Tooltip title="Stock">
                    <Badge
                        badgeContent={item.stock}
                        color='success'
                        overlap="circular"
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        style={{ position: 'absolute', margin: '20px' }}
                    />

                </Tooltip>
                <CardMedia
                    component="img"
                    height="120"
                    image={item.s3ObjectUrl ? item.s3ObjectUrl : brand_img}
                    alt="green iguana"
                />
                {/* <CardContent>
          <Typography variant="subtitle2" gutterBottom component="div">
            {item.description}
          </Typography>          
        </CardContent> */}
                <CardContent  >

                    <Grid container alignItems="center">
                        <Grid item xs>
                            <Typography gutterBottom variant="subtitle2" component="div">
                                {item.code}
                            </Typography>

                        </Grid>
                        <Grid item>
                            <Typography gutterBottom variant="body2" component="div">
                                <Badge color="primary" badgeContent={`$${0}`} />
                            </Typography>
                        </Grid>
                    </Grid>
                    <Typography color="text.secondary" variant="caption">
                        {item.description}
                    </Typography>
                </CardContent>

            </CardActionArea>
        </Card>
    );
}
