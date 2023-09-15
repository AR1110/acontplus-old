import { Box, Button, Card, CardActions, CardContent, Grid, Tab, Tabs, Typography } from '@mui/material'
import RightOrderItemTable from './RightOrderItemTable'
import { useSplitAccountContext } from '../../context';
import { SaveIcon } from '@/core/components/IconsMaterial';
import { useState } from 'react';

const RightOrderItem = () => {
    const { rightOrder } = useSplitAccountContext();
    const [value, setValue] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

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

                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="icon position tabs example"
                    >
                        <Tab iconPosition="start" label="start" />
                        <Tab iconPosition="start" label="start" />
                    </Tabs>

                    {
                        value === 0 && (

                            <Box sx={{ mt: 1 }}>
                                <RightOrderItemTable />
                            </Box>
                        )
                    }
                    {
                        value === 1 && (
                            <Box sx={{ p: 3 }}>
                                Hola
                            </Box>
                            
                        )
                    }

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