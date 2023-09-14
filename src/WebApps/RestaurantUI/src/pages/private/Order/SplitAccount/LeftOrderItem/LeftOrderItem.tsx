import { Card, CardActions, CardContent, CardHeader, Stack, Typography } from '@mui/material'
import { useSplitAccountContext } from '../../context'
import LeftOrderItemTable from './LeftOrderItemTable';

const LeftOrderItem = () => {
    const {order, leftOrderItems} = useSplitAccountContext();
 
    return (
        <>
            <Card>
                <CardHeader/>
                <CardContent>
                    <LeftOrderItemTable />
                </CardContent>
                <CardActions>

                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="flex-end"
                        spacing={2}
                    >

                        {/* <Typography variant="body2" color="text.primary">
                        SubTotal: ${order.subTotalSinImpuestos}
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                        IVA (12%): ${order.tax}
                    </Typography> */}
                        <Typography variant="h6" color="error">
                            Total: $0
                        </Typography>
                    </Stack>

                </CardActions>
            </Card>
        </>
    )
}

export default LeftOrderItem