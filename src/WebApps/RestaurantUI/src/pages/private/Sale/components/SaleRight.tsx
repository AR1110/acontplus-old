import { Box, Button, Divider, Grid, List, ListItem, ListItemText, Paper, Typography } from '@mui/material'
 
import CustomerSearch from './CustomerSearch'
import { MonetizationOnIcon, RestartAltIcon } from '@/core/components'
import TableSelect from './TableSelect'
import ItemaTable from './ItemTable'
import { saleStore } from '@/stores/saleStore'

const listItemCustom = {
    paddingTop: '2px',
    paddingBottom: '2px'
}

export default function SaleRight() {
    const summary = saleStore(state => state.summary);
    const resetForm = saleStore(state => state.resetForm);

    return (
        <Paper elevation={1} sx={{
            borderRadius: '12px',
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            bgcolor: 'background.paper'
        }} >

            <Grid container
                direction="row"
                justifyContent="space-between"
                alignItems="center">
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <CustomerSearch />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={5}>
                    <TableSelect />
                </Grid>
            </Grid>

            <ItemaTable />

            {/* Totals */}
            <List>
                <Divider />
                <ListItem sx={listItemCustom}>
                    <ListItemText>
                        <Typography variant="subtitle2" gutterBottom>
                            SubTotal
                        </Typography>
                    </ListItemText>
                    <Typography variant="subtitle2">${summary.total.toFixed(2)}</Typography>

                </ListItem>
                <ListItem sx={listItemCustom}>
                    <ListItemText>
                        <Typography variant="subtitle2" gutterBottom>
                            IVA (12%)
                        </Typography>
                    </ListItemText>
                    <Typography variant="subtitle2">${summary.taxAmount.toFixed(2)}</Typography>
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText>
                        <Typography variant="h6" gutterBottom>
                            Total
                        </Typography>
                    </ListItemText>
                    <Typography color="error" variant="h6" gutterBottom>${summary.netTotal.toFixed(2)}</Typography>
                </ListItem>
            </List>
            {/**End totals */}
            <Box sx={{ flexGrow: 1, p: 2 }}>
                <Grid container spacing={2} columns={16}>
                    <Grid item xs={8}>
                        <Button color="error" variant="contained" size="large" fullWidth endIcon={<RestartAltIcon />} onClick={resetForm}>
                            Limpiar
                        </Button>
                    </Grid>
                    <Grid item xs={8}>
                        <Button color="success" variant="contained" size="large" fullWidth endIcon={<MonetizationOnIcon />}>
                            Guardar
                        </Button>
                    </Grid>
                </Grid>
            </Box>

        </Paper>
    )
}
