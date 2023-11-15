 
import { useNavigate } from 'react-router-dom'
import { AppBar,Button, Grid, IconButton, MenuItem, TextField, Toolbar, Tooltip } from '@mui/material'
import { CustomerSearchFilter, DateRangeFilter } from '.'
import { RefreshIcon } from '@/core/components/IconsMaterial'
import { useOrderContext } from '../context'
import dayjs from 'dayjs'
import { PrivateRoutes } from '@/core/models'

const OrderFilter = () => {
    const navigate = useNavigate();
    const { fetchOrders, dataFilter, setDataFilter, tables } = useOrderContext();
     
    const onchangeDateStart = (date: any) => {
        setDataFilter('startDate', date.format()); 
    }

    const onchangeDateEnd = (date: any) => {
        setDataFilter('endDate', date.format());
    }

    const handleNewOrder = () => {
        navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.SALE}`, { replace: true })
    }

    const onChangeTable = (tableId:number)=>{
        setDataFilter('tableId', tableId); 
    }
    return (
        <>
            <AppBar
                position="static"
                color="default"
                elevation={0}
            // sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
            > 
                <Toolbar sx={{ mt: 2 }}> 
                    <Grid container spacing={0.5}>
                        <Grid item xs={12} sm={12} md={12} lg={10} xl={10}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} md={3} lg={3}>
                                    <DateRangeFilter
                                        label="Fecha Inicio"
                                        value={dayjs(dataFilter.startDate)}
                                        onChange={onchangeDateStart} />
                                </Grid>
                                <Grid item xs={12} md={3} lg={3}>
                                    <DateRangeFilter
                                        label="Fecha Fin"
                                        value={dayjs(dataFilter.endDate)}
                                        onChange={onchangeDateEnd} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <CustomerSearchFilter />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    {
                                        tables.length>0 && (
                                            <TextField
                                                id="table"
                                                select
                                                label="Mesa" 
                                                value={dataFilter.tableId}
                                                fullWidth
                                                onChange={(e) => onChangeTable(Number(e.target.value))}
                                            >
                                                <MenuItem value={0}>
                                                    Todos
                                                </MenuItem>
                                                {
                                                    tables.length > 0 && tables.map((table:any, index:number) => (
                                                        <MenuItem key={index} value={table.id}>
                                                            {table.roomDescription} - {table.description} 
                                                        </MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        )
                                    }
                                    
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={2} xl={2}>
                            <Grid
                                container
                                direction="row"
                                justifyContent="flex-end"
                                alignItems="center"
                            >

                                <Button variant="contained" sx={{ mr: 1 }} onClick={handleNewOrder}>
                                    Nuevo
                                </Button>
                                <Tooltip title="Reload">
                                    <IconButton onClick={fetchOrders}>
                                        <RefreshIcon color="inherit" sx={{ display: 'block' }} />
                                    </IconButton>
                                </Tooltip>

                            </Grid>
                        </Grid>
                    </Grid>  
                </Toolbar>
            </AppBar>
        </>
    )
}

export default OrderFilter