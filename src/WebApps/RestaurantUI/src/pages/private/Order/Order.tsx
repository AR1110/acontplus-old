import { RefreshIcon, SearchIcon } from "@/core/components";
import { PrivateRoutes, OrderReadDto } from "@/core/models";
import { AppBar, Button, Grid, IconButton, Paper, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import OrderTable from "./OrderTable";
import { useEffect, useState } from "react";
import { OrdenService } from "@/core/services";
import { useLoaderStore, useOrderStore } from "@/stores";
import { orderReadAdapter } from "@/core/adapters";
import DateRangeFilter from "./Components/DateRangeFilter";
import { CustomerSearchFilter } from "./Components";
import dayjs from 'dayjs';


export default function Order() {
    const navigate = useNavigate(); 
    // const setOrders = useOrderStore(state => state.setOrders); 
    const getOrders = useOrderStore(state => state.getOrders); 
    const orderFilter = useOrderStore(state => state.orderFilter); 
    const setOrderFilter = useOrderStore(state => state.setOrderFilter); 

    const handleNewOrder = () => {
        navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.SALE}`, { replace: true })
    }

    // const getOrders = async () => {
    //     showLoader(true)
    //     await OrdenService.get({ pageIndex: 1, pageSize: 2, tipo: 1 }).then(response => {
    //         console.log(response.orders)
    //         setOrders(orderReadAdapter(response.orders))
    //     }).finally(() => showLoader(false))
    // }

    useEffect(() => {
        getOrders();
    }, [])

    const onchangeDateStart = (date:any)=>{ 
        setOrderFilter({
            ...orderFilter,
            startDate: date.format()
        })
    }

    const onchangeDateEnd = (date:any)=>{
        setOrderFilter({
            ...orderFilter,
            endDate: date.format()
        })
    }

    return (
        <Paper sx={{ maxWidth: "auto", margin: 'auto', overflow: 'hidden' }}>
            <AppBar
                position="static"
                color="default"
                elevation={0}
            // sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
            >
                <Toolbar sx={{mt:1}}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <DateRangeFilter 
                                    label="Fecha Inicio" 
                                    value={dayjs(orderFilter.startDate)} 
                                    onChange={onchangeDateStart} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                <DateRangeFilter 
                                    label="Fecha Fin" 
                                    value={dayjs(orderFilter.endDate)} 
                                    onChange={onchangeDateEnd} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <CustomerSearchFilter/>
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
                                    <IconButton onClick={getOrders}>
                                        <RefreshIcon color="inherit" sx={{ display: 'block' }} />
                                    </IconButton>
                                </Tooltip>

                            </Grid>
                        </Grid>
                    </Grid>
                    {/* <Grid container spacing={2} alignItems="center">

                        <Grid item xs={4}>
                            <DateRangeFilter label="Fecha Inicio"/> 
                        </Grid>
                        <Grid item xs={4}>
                            <DateRangeFilter label="Fecha Fin"/> 
                        </Grid>
                        <Grid item xs={4}>
                            <DateRangeFilter label="Fecha Fin"/> 
                        </Grid>
                        <Grid item xs={4}>
                            <Button variant="contained" sx={{ mr: 1 }} onClick={handleNewOrder}>
                                Nuevo
                            </Button>
                            <Tooltip title="Reload">
                                <IconButton onClick={getOrders}>
                                    <RefreshIcon color="inherit" sx={{ display: 'block' }} />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid> */}
                </Toolbar>
            </AppBar>

            <OrderTable/>

            {/* <Typography sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">
      No users for this project yet
    </Typography> */}
        </Paper>
    )
}
