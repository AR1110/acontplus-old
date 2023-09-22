import { IPromotion } from '@/core/models'
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'

type PromotionCardProps = {
    promotion: IPromotion
}


const PromotionCard = ({ promotion }: PromotionCardProps) => {
    return (
        <Card sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '190px',
            //maxHeight: "200px",
            borderRadius: "16px"
        }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image="/static/images/cards/contemplative-reptile.jpg"
                    alt="green iguana"
                />
                <CardContent>
                    <Typography variant="caption" component="div" noWrap>
                        {promotion.description}
                    </Typography> 
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default PromotionCard