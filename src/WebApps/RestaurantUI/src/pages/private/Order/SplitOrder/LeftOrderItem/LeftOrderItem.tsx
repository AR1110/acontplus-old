import { Button, Card, CardContent, Divider, Grid, Stack, Typography } from '@mui/material'
import { useSplitOrderContext } from '../../context'
import LeftOrderItemTable from './LeftOrderItemTable';
import { useState } from 'react';
import DialogCustomOrderItem from '../DialogCustomOrderItem/DialogCustomOrderItem';

const LeftOrderItem = () => {
    const { 
        leftOrderItemsLength, 
        leftOrder, 
        leftCheckedOrderItems, 
        calculateOrderItemTotal,
        setChangeOrderItems 
    } = useSplitOrderContext();
    
    const objTempTotal = calculateOrderItemTotal(leftCheckedOrderItems);
    const [openDialogCustom, setOpenDialogCustom] = useState(false);

    const handleClickOpenDialogCustom = ()=>{    
        setChangeOrderItems(leftCheckedOrderItems)            
        setOpenDialogCustom(true)
    }


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
                                        <Typography variant="body2">
                                            <b>Cant:</b> {objTempTotal.remainingQuantity}
                                        </Typography>
                                        <Typography variant="body2">
                                            <b>Total:</b> {objTempTotal.total}
                                        </Typography>
                                    </Stack>
                                )
                            }
                        </Grid>
                    </Grid>

                    {
                        leftCheckedOrderItems.length > 0 && leftOrderItemsLength === leftCheckedOrderItems.length && (
                            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                <Button size="large" fullWidth variant='contained' onClick={handleClickOpenDialogCustom}>
                                    Detalle Personalizado
                                </Button>
                            </Stack>
                        )
                    }


                    <LeftOrderItemTable />

                </CardContent>
            </Card> 
            {
                openDialogCustom && <DialogCustomOrderItem open={openDialogCustom} setOpen={()=>{
                    setOpenDialogCustom(false)
                }}/>
            }
        </>
    )
}

export default LeftOrderItem