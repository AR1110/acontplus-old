
import { Button, Grid } from '@mui/material'
import { useSplitAccountContext } from '../../context';



const MiddleAction = () => {
    const { intersection, not} = useSplitAccountContext();
    const { checkedOrderItems, setCheckedOrderItem } = useSplitAccountContext();
    const { leftOrderItems, setLeftOrderItem } = useSplitAccountContext();
    const { rightOrderItems, setRightOrderItem } = useSplitAccountContext();

    const leftChecked = intersection(checkedOrderItems, leftOrderItems);
    const rightChecked = intersection(checkedOrderItems, rightOrderItems);

    const handleCheckedRight = () => {
        setRightOrderItem(rightOrderItems.concat(leftChecked));
        setLeftOrderItem(not(leftOrderItems, leftChecked));
        setCheckedOrderItem(not(checkedOrderItems, leftChecked));
        
        
    };

    const handleCheckedLeft = () => {
        setLeftOrderItem(leftOrderItems.concat(rightChecked));
        setRightOrderItem(not(rightOrderItems, rightChecked));
        setCheckedOrderItem(not(checkedOrderItems, rightChecked));
    };

    return (
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
    )
}

export default MiddleAction