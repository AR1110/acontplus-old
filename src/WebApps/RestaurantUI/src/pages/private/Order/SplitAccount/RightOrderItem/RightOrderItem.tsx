import { Button, Card, CardActions, CardContent, Grid, TextField, Typography } from '@mui/material'
import RightOrderItemTable from './RightOrderItemTable'
import { useSplitAccountContext } from '../../context';
import { SaveIcon } from '@/core/components/IconsMaterial';

const RightOrderItem = () => {
    const { rightOrder } = useSplitAccountContext();
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                                <Grid item xs>
                                    <Typography variant="h6" component="div">
                                        Cuenta Individual
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5">
                                    Total: ${rightOrder.total}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ mb: 1 }}>
                        <Grid item md={12} lg={12}>


                        </Grid>
                    </Grid>
                    <RightOrderItemTable />
                </CardContent>
                <CardActions>
                    <Button fullWidth variant="contained" color='success' size='large' startIcon={<SaveIcon />}>
                        Guardar
                    </Button>
                </CardActions>
            </Card>
        </>
    )
}

export default RightOrderItem