import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AppBar, Button, Grid, IconButton, Toolbar, Tooltip } from '@mui/material'
import { CustomerSearchFilter, DateRangeFilter } from '.'
import { RefreshIcon } from '@/core/components/IconsMaterial'
import { useOrderContext } from '../context'
import dayjs from 'dayjs'
import { PrivateRoutes } from '@/core/models'

const OrderFilter = () => {
    const navigate = useNavigate();
    const { fetchOrders, dataFilter, setDataFilter } = useOrderContext();

    const onchangeDateStart = (date: any) => {
        setDataFilter('startDate', date.format()); 
    }

    const onchangeDateEnd = (date: any) => {
        setDataFilter('endDate', date.format());
    }

    const handleNewOrder = () => {
        navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.SALE}`, { replace: true })
    }
    return (
        <>
            <AppBar
                position="static"
                color="default"
                elevation={0}
            // sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
            >
                <Toolbar sx={{ mt: 1 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <DateRangeFilter
                                        label="Fecha Inicio"
                                        value={dayjs(dataFilter.startDate)}
                                        onChange={onchangeDateStart} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <DateRangeFilter
                                        label="Fecha Fin"
                                        value={dayjs(dataFilter.endDate)}
                                        onChange={onchangeDateEnd} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <CustomerSearchFilter />
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
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