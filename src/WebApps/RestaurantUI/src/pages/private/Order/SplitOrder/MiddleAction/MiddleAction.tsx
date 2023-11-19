
import { Button, Grid } from '@mui/material'
import { useSplitOrderContext } from '../../context';
import { useState } from 'react';
import DialogChangeQty from './DialogChangeQty';



const MiddleAction = () => {
    const { intersection, not, mergeArraysByFieldLeft, setLeftCheckedOrderItems} = useSplitOrderContext();
    const {leftCheckedOrderItems, rightCheckedOrderItems} =  useSplitOrderContext(); 

    const { leftOrderItems, setLeftOrderItem } = useSplitOrderContext(); 
    const { rightOrderItems, setRightOrderItem } = useSplitOrderContext();
    
    const { setChangeOrderItems } = useSplitOrderContext(); //Setted checked order items when left order have qty greater than 1
    
    const {mergeArraysByField} = useSplitOrderContext();

    const leftChecked = intersection(leftCheckedOrderItems, leftOrderItems);
    const rightChecked = intersection(rightCheckedOrderItems, rightOrderItems);

    //Modal cambiar cantidades
    const [open, setOpen] = useState(false)
 
    //Cuando pasamos items a segunda tabla
    const handleCheckedRight = () => {
        const filteredItems = leftChecked.filter(orderItem => orderItem.remainingQuantity > 1); 
        if (filteredItems.length > 0) {
            setChangeOrderItems(leftChecked)
            setOpen(true)
            return
        }

        const mergeRightOrderItems = mergeArraysByField(leftChecked, rightOrderItems, 'id');
        const mergeLeftOrderItems = mergeArraysByFieldLeft(leftChecked, leftOrderItems, 'id');
        
        setRightOrderItem(mergeRightOrderItems);
        setLeftOrderItem(mergeLeftOrderItems);
        setLeftCheckedOrderItems([]);
        setChangeOrderItems([])
    };

    const handleCheckedLeft = () => {
        const mergeRightOrderItems = mergeArraysByField(rightChecked, leftOrderItems, 'id');
        setLeftOrderItem(mergeRightOrderItems);
        setRightOrderItem(not(rightOrderItems, rightChecked));      
    };


    return (
        <>
            <Grid container direction="column" alignItems="center">
                <Button
                    sx={{ my: 0.5 }}
                    variant="outlined"
                    size="small"
                    onClick={handleCheckedRight}
                    disabled={leftChecked.length === 0}
                    aria-label="move selected right"
                >
                    &gt;
                </Button>
                <Button
                    sx={{ my: 0.5 }}
                    variant="outlined"
                    size="small"
                    onClick={handleCheckedLeft}
                    disabled={rightChecked.length === 0}
                    aria-label="move selected left"
                >
                    &lt;
                </Button>
            </Grid>
            {
                open && <DialogChangeQty open={open} setOpen={() => {
                    setOpen(false)
                }} />
            }
        </>
    )
}

export default MiddleAction