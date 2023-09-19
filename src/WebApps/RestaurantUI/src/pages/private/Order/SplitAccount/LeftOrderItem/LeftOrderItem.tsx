import { Card, CardContent, Divider, Grid, Stack, Typography } from '@mui/material'
import { useSplitAccountContext } from '../../context'
import LeftOrderItemTable from './LeftOrderItemTable';

const LeftOrderItem = () => {
    const { leftOrder, leftCheckedOrderItems, calculateOrderItemTotal } = useSplitAccountContext();
    const objTempTotal = calculateOrderItemTotal(leftCheckedOrderItems)
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container alignItems="center">
                        <Grid item xs={12} sm={6} md={6}  >
                            <Typography variant="h6" component="div">
                                Cuenta General
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}  >
                            <Typography variant="h6" color="text.primary" align='right'>
                                Total: ${leftOrder.total}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 1 }} />
                    <Grid container alignItems="center">
                        <Grid item xs>
                            <Typography variant="body2" color="text.secondary">
                                <b>Cliente:</b> {leftOrder.customerName}
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} variant="body2" color="text.secondary">
                                <b>Observación:</b> {leftOrder.obs ||= 'Ninguna'}
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            {
                                leftCheckedOrderItems.length > 0 && (
                                    <Stack direction="column"
                                    justifyContent="center"
                                    alignItems="flex-end">
                                        <Typography variant="body2" color="text.secondary">
                                            <b>Cant:</b> {objTempTotal.quantity}
                                        </Typography> 
                                        <Typography variant="body2" color="text.secondary">
                                            <b>Total:</b> {objTempTotal.total}
                                        </Typography>
                                    </Stack>
                                )
                            }
                        </Grid>
                    </Grid>

                    <LeftOrderItemTable />

                </CardContent>
            </Card>
        </>
    )
}

export default LeftOrderItem