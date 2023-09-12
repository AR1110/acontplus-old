 
import { Box, Grid} from '@mui/material'; 
import ItemCard from './ItemCard';
import { useSaleStore } from '@/stores/saleStore';
import ItemListSkeleton from './ItemListSkeleton'; 
import ItemPagination from './ItemPagination';

interface ItemListProps {
    loading: boolean
}

export default function ItemList({ loading }: ItemListProps) {
    const itemList = useSaleStore(state => state.collectionItems);

    return (
        
        <Box sx={{ pt: 2}}>
            <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 12, sm: 12, md: 12 }} sx={{
                pr: 1,
                pb:1,
                height: "440px", // Ajusta la altura según tus necesidades
                overflow: 'auto', // Agrega el scroll si el contenido excede la altura

                // Consulta de medios para tamaños de pantalla más pequeños
                '@media (max-width: 600px)': {
                    height: '400px', // Altura reducida para pantallas más pequeñas
                },
            }}> 
                {loading ?
                    (<ItemListSkeleton />)
                    :
                    (
                        itemList.map((item, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index} >
                                <ItemCard item={item} />
                            </Grid>
                        ))
                    )
                }
            </Grid>  
            <ItemPagination/>
        </Box> 
    );
}

