
import { Button, Grid } from '@mui/material'
import { useSplitAccountContext } from '../../context';
import { useState } from 'react';
import DialogChangeQty from './DialogChangeQty';



const MiddleAction = () => {
    const { intersection, not } = useSplitAccountContext();
    const { checkedOrderItems, setCheckedOrderItem } = useSplitAccountContext();
    const { leftOrderItems, setLeftOrderItem } = useSplitAccountContext();
    const { rightOrderItems, setRightOrderItem } = useSplitAccountContext();
    const { setFilteredItems } = useSplitAccountContext();

    const leftChecked = intersection(checkedOrderItems, leftOrderItems);
    const rightChecked = intersection(checkedOrderItems, rightOrderItems);
    const [open, setOpen] = useState(false)

    const handleCheckedRight = () => {
        const filteredItems = leftChecked.filter(orderItem => orderItem.quantity > 1);
        if (filteredItems.length > 0) {
            setFilteredItems(leftChecked)
            setOpen(true)
            return
        }

        let cloneLeftCheckedItems = [...leftChecked];
        const closeRightItems = [...rightOrderItems]
        cloneLeftCheckedItems = cloneLeftCheckedItems.map((checkedOrderItem) => {
            const objetoEnArray2 = closeRightItems.find((rightOrderItem) => rightOrderItem.id === checkedOrderItem.id);

            if (objetoEnArray2) {
                // Suma la cantidad de array1 a array2
                const qty = objetoEnArray2.quantity + checkedOrderItem.quantity;
                const total = qty * objetoEnArray2.price;
                objetoEnArray2.quantity = qty;
                objetoEnArray2.total = total;
                // Retorna null para eliminar el objeto de array1
                return null as any;
            }
            closeRightItems.push(checkedOrderItem)
            // Retorna el objeto sin cambios si no se encuentra en array2
            return checkedOrderItem;
        });
        // console.log(filteredItems)
        // const results = leftChecked.map(order=>{
        //     const dataRight = rightOrderItems.find(orderR=>orderR.id===order.id);
        //     if(dataRight){

        //     }
        // })
        cloneLeftCheckedItems = cloneLeftCheckedItems.filter((item) => item !== null);
        //  setRightOrderItem(rightOrderItems.concat(leftChecked));
        setRightOrderItem(closeRightItems);
        setLeftOrderItem(not(leftOrderItems, leftChecked));
        setCheckedOrderItem([]);
        //setCheckedOrderItem(not(checkedOrderItems, leftChecked));
        //setOpen(true)
    };

    const handleCheckedLeft = () => {
        // setLeftOrderItem(leftOrderItems.concat(rightChecked));
        // setRightOrderItem(not(rightOrderItems, rightChecked));
        // setCheckedOrderItem(not(checkedOrderItems, rightChecked));
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