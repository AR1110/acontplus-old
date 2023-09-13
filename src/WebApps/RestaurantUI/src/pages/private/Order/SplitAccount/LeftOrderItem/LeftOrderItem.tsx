import { Card, CardActions, CardContent, CardHeader, Stack, Typography } from '@mui/material'
import OrderItemTable from '../OrderItemTable/OrderItemTable'

const LeftOrderItem = () => {
    return (
        <>
            <Card>
                <CardHeader/>
                <CardContent>
                    <OrderItemTable />
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