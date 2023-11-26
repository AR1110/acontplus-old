
import { Grid } from '@mui/material';
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
                    <Grid container spacing={2} columns={{ xs: 4, sm: 9, md: 12, lg:16}}>
                        {itemList.map((itemCart, index) => (
                            <Grid item xs={2} sm={3} md={4} lg={4} key={index} >
                                <ItemCard item={itemCart} />
                            </Grid>
                            // <Grid item xs={2} sm={4} md={4} key={index}>
                            //     xs=2
                            // </Grid>
                        ))}
                    </Grid>
                    // itemList.map((item, index) => (
                    //     <Grid item xs={6} sm={6} md={3} key={index} >
                    //         <ItemCard item={item} />
                    //     </Grid>
                    // ))
                )
            }

        </>
    );
}

