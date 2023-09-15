import { Card, CardActions, CardContent, CardHeader, Divider, Grid, Stack, Typography } from '@mui/material'
import { useSplitAccountContext } from '../../context'
import LeftOrderItemTable from './LeftOrderItemTable';

const LeftOrderItem = () => {
    const { leftOrder } = useSplitAccountContext();

    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                                <Grid item xs>
                                    <Typography variant="h6" component="div">
                                        Cuenta General
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <b>Cliente:</b> {leftOrder.customerName}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} variant="body2" color="text.secondary">
                                        <b>Observación:</b> {leftOrder.obs ||= 'Ninguna'}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5" color="text.primary">
                                    Total: ${leftOrder.total}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <LeftOrderItemTable />

                </CardContent>
            </Card>
        </>
    )
}

export default LeftOrderItem