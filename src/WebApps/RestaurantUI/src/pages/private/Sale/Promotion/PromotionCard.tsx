import { IPromotion } from '@/core/models'
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'
import promotion_img from '/assets/promotion.webp';
import { useEffect } from 'react';
import { promotionMenuService } from '@/core/services';
type PromotionCardProps = {
    promotion: IPromotion
}


const PromotionCard = ({ promotion }: PromotionCardProps) => {

    let controller: AbortController;

    const handleClickPromotion = async () => {
        try {
             
            // Intentamos realizar una búsqueda de productos utilizando un servicio llamado 'productService'
            // pasando la cadena de búsqueda 'value' como parámetro.
            const dataFetch = promotionMenuService.getById(promotion.id);

            // Si ya existe un controlador de solicitud activo (abortController), lo abortamos.
            if (controller) controller.abort();

            // Establecemos el nuevo controlador de solicitud para esta búsqueda.
            controller = dataFetch.controller;


            // Realizamos la llamada a la búsqueda utilizando 'dataFetch.call' y esperamos su resultado.
            const resultAxios = await dataFetch.call;

            // Extraemos los datos de la respuesta Axios.
            const response = resultAxios.data;
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }
 
    useEffect(() => { 
        return () => {
            controller && controller.abort();
        }
    }, [])

    return (
        <Card variant="outlined" sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '190px',
            //maxHeight: "200px",
            borderRadius: "16px"
        }}>
            <CardActionArea onClick={() => handleClickPromotion()}>
                <CardMedia
                    component="img"
                    height="130"
                    image={promotion_img}
                    alt="green iguana"
                />
                <CardContent>
                    <Typography variant="subtitle2" component="div" noWrap>
                        {promotion.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default PromotionCard