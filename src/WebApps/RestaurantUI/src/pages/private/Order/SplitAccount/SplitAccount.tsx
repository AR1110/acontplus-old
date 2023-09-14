 
import Grid from '@mui/material/Grid'; 
import LeftOrderItem from './LeftOrderItem/LeftOrderItem';
import RightOrderItem from './RightOrderItem/RightOrderItem';
import { useSplitAccountContext } from '../context';
import { useEffect } from 'react';
import { Button, Stack } from '@mui/material';
 

type Props = {
    id: number
}
const SplitAccount = ({id}:Props) => { 
    const {fetchOrderData} = useSplitAccountContext();

    useEffect(()=>{
        fetchOrderData(id)
    }, [])
    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={5} md={5} lg={5}>
               <LeftOrderItem/>
            </Grid>
            <Grid item>
                <Stack spacing={1} justifyItems="center" justifyContent="flex-start">
                    <Button
                        variant="outlined"
                        size="small"
                        
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                         
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Stack> 
            </Grid>
            <Grid item xs={12} sm={5} md={5} lg={5}>
                <RightOrderItem/>
            </Grid>
        </Grid>
    );
}

export default SplitAccount;