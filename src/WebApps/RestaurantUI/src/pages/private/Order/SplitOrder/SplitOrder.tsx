
import { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import LeftOrderItem from './LeftOrderItem/LeftOrderItem';
import RightOrderItem from './RightOrderItem/RightOrderItem';
import { useSplitOrderContext } from '../context';
import MiddleAction from './MiddleAction/MiddleAction';
import { getEstabs } from '@/core/services';


type Props = {
    id: number
}
const SplitOrder = ({ id }: Props) => {
    const { fetchOrderData } = useSplitOrderContext();

    useEffect(() => {
        fetchOrderData(id); 
    }, [])
    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center" columns={16}>
            <Grid item xs={16} sm={7} md={7} lg={7}>
                <LeftOrderItem />
            </Grid>
            <Grid item>
                <MiddleAction />
            </Grid>
            <Grid item xs={16} sm={7} md={7} lg={7}>
                <RightOrderItem />
            </Grid>
        </Grid>
    );
}

export default SplitOrder;