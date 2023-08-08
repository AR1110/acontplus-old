 
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Badge, CardActionArea } from '@mui/material';
import brand_img from '/assets/images/brand_logo.png';
import soundBeep from '/sound/beep-29.mp3';
import { ProductReadDto } from '@/core/models';

type ProductCardProps = {
  product: ProductReadDto
}

const customCard =  {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  borderRadius: "16px",
  borderColor: '#6571ff !important',
  border: '1px solid',
}
const cardContent =  {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}

const flexRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

export default function ProductCard({product}: ProductCardProps) {


  const beep = ()=> {
    playSound(soundBeep);
  }

  const clearSound = ()=> {
    playSound("sound/button-21.mp3");
  }


  function playSound(src: string): void {
    const sound = new Audio();
    sound.src = src;
    sound.play();
    sound.onended = () => {
      // eslint-disable-next-line no-delete-var
       
    };
  }

  return (
    <Card sx={customCard}>
      <CardActionArea onClick={beep}>
        <CardMedia
          component="img"
          height="140"
          image={brand_img}
          alt="green iguana"
        />
        {/* <CardContent>
          <Typography variant="subtitle2" gutterBottom component="div">
            {product.description}
          </Typography>          
        </CardContent> */}
        <CardContent style ={{
           flexGrow: 1,
           display: 'flex',
           flexDirection: 'column',
           justifyContent: 'space-between',
           paddingLeft: "0.5rem!important",
          paddingRight: "0.5rem!important",
          paddingTop: "0.5rem!important",
          paddingBottom: "0.25rem!important"
        }}>
          {/* <Typography variant="body2" color="text.secondary">
            {product.code}
          </Typography>
          <Typography variant="body2" color="text.secondary">            
            <Badge color="primary" badgeContent={`$${product.unitPrice}`}/>                          
          </Typography> */}
          
        <Typography variant="subtitle2" gutterBottom>
        {product.description}
      </Typography>
        <div style={flexRow}>
          <Typography variant="caption">{product.code}</Typography>
          <Typography variant="body2">
            <Badge color="primary" badgeContent={`$${product.unitPrice}`}/>  
          </Typography>
        </div>
        </CardContent>
         
      </CardActionArea>
    </Card>
  );
}
