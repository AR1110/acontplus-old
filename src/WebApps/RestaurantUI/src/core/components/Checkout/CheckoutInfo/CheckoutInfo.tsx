 
import Box from '@mui/material/Box'; 
import Grid from '@mui/material/Grid'; 
import Typography from '@mui/material/Typography';
import { Card } from '@mui/material'; 
import { useCheckoutContext } from '../context';

const CheckoutInfo = () => {
    const {checkout} = useCheckoutContext();
    const voucher = checkout.voucher;
    return (
        <Card variant="outlined">
            <Box sx={{ p: 2 }}>
                <Grid container alignItems="center">                    
                    <Grid item xs>
                        <Typography gutterBottom variant="subtitle2" component="div">
                            Nro. Documento:
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography gutterBottom variant="body2" component="div">
                            {voucher.nroDoc}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container alignItems="center">                    
                    <Grid item xs>
                        <Typography gutterBottom variant="subtitle2" component="div">
                            Cliente:
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography gutterBottom variant="body2" component="div">
                            {voucher.customerName}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container alignItems="center">                    
                    <Grid item xs>
                        <Typography gutterBottom variant="subtitle2" component="div">
                            Numero Identificación:
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography gutterBottom variant="body2" component="div">
                        {voucher.customerIdentification}
                        </Typography>
                    </Grid>
                </Grid> 
            </Box> 
        </Card>
    )
}

export default CheckoutInfo
