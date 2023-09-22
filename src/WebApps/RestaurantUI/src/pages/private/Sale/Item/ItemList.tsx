
import { Box, Grid } from '@mui/material';
import ItemCard from './ItemCard';
import { useSaleStore } from '@/stores/saleStore';
import ItemListSkeleton from './ItemListSkeleton'; 
import CustomNoRowsOverlay from '@/core/components/CustomNoRowsOverlay/CustomNoRowsOverlay';

interface ItemListProps {
    loading: boolean
}

export default function ItemList({ loading }: ItemListProps) {
    const itemList = useSaleStore(state => state.collectionItems);


    return (

        <>
            {
                loading && <ItemListSkeleton />
            }
            {
                !loading && itemList.length === 0 && (
                    <Grid item container lg={12} justifyContent="center">
                        <CustomNoRowsOverlay />
                    </Grid>
                )
            }
            {
                itemList.length > 0 && (
                    itemList.map((item, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index} >
                            <ItemCard item={item} />
                        </Grid>
                    ))
                )
            }

        </>
    );
}

