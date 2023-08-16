
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Badge, CardActionArea, Grid, Tooltip } from '@mui/material';
import brand_img from '/assets/images/brand_logo.png';

import { ItemReadDto } from '@/core/models';
import { saleStore } from '@/stores/saleStore';

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
  const cartItems = saleStore(state => state.cartItems)

  const handleSelectItem = (item: ItemReadDto) => {
    addItemToCart({
      index: 0,
      productId: item.productId,
      code: item.code,
      name: item.description,      
      qty: 1,
      price: 0,
      discount: 0,
      discountTotal: 0,
      sellingPrice: 0,
      totalPrice: 0,
      s3ObjectUrl: item.s3ObjectUrl ? item.s3ObjectUrl : brand_img
    })
  }

  return (
    <Card sx={
      {
        display: 'flex',
        flexDirection: 'column',
        height: '200px', 
        borderRadius: "16px",
        borderColor: cartItems.some(cartItem=>cartItem.code===item.code) ? '#6571ff !important' : '',

        border: cartItems.some(cartItem=>cartItem.code===item.code) ? '1px solid' : '',
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
          image={item.s3ObjectUrl ? item.s3ObjectUrl: brand_img}
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
