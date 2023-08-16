
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Badge, CardActionArea, Grid, Tooltip } from '@mui/material';
import brand_img from '/assets/images/brand_logo.png';

import { ProductReadDto } from '@/core/models';
import { saleStore } from '@/stores/saleStore';

type ProductCardProps = {
  product: ProductReadDto
}

const customCard = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  borderRadius: "16px",
  borderColor: '#6571ff !important',
  border: '1px solid',
}
const cardContent = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  paddingLeft: "0.5rem!important",
  paddingRight: "0.5rem!important",
  paddingTop: "0.5rem!important",
  paddingBottom: "0.25rem!important"
}

const flexRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItemToCart = saleStore(state => state.addItemToCart)

  const handleSelectItem = (item: ProductReadDto) => {
    addItemToCart({
      index: 0,
      productId: item.productId,
      name: item.description,
      qty: 1,
      price: item.unitPrice,
      discount: 0,
      discountTotal: 0,
      sellingPrice: item.unitPrice,
      totalPrice: item.unitPrice, 
      s3ObjectUrl: item.s3ObjectUrl ? item.s3ObjectUrl : brand_img
    })
  }

  return (
    <Card sx={
      {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: "16px",
        borderColor: product.code == '14P5' ? '#6571ff !important' : '',

        border: product.code == '14P5' ? '1px solid' : '',
      }
    }>
      <CardActionArea onClick={() => handleSelectItem(product)}>
        <Tooltip title="Stock">
          <Badge
            badgeContent={product.stock}
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
          image={product.s3ObjectUrl ? product.s3ObjectUrl: brand_img}
          alt="green iguana"
        />
        {/* <CardContent>
          <Typography variant="subtitle2" gutterBottom component="div">
            {product.description}
          </Typography>          
        </CardContent> */}
        <CardContent  >

          <Grid container alignItems="center">
            <Grid item xs>
              <Typography gutterBottom variant="subtitle2" component="div">
                {product.code}
              </Typography>

            </Grid>
            <Grid item>
              <Typography gutterBottom variant="body2" component="div">
                <Badge color="primary" badgeContent={`$${product.unitPrice}`} />
              </Typography>
            </Grid>
          </Grid>
          <Typography color="text.secondary" variant="caption">
            {product.description}
          </Typography>

          {/* 
          <Typography variant="subtitle2" gutterBottom>
            {product.description}
          </Typography>
          <div style={flexRow}>
            <Typography variant="caption">{product.code}</Typography>
            <Typography variant="body2">
              <Badge color="primary" badgeContent={`$${product.unitPrice}`} />
            </Typography>
          </div> */}
        </CardContent>

      </CardActionArea>
    </Card>
  );
}
