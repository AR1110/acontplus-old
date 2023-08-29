import { RefreshIcon, SearchIcon } from "@/core/components";
import { PrivateRoutes, OrderReadDto } from "@/core/models";
import { AppBar, Button, Grid, IconButton, Paper, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import OrderTable from "./OrderTable";
import { useEffect, useState } from "react";
import { OrdenService } from "@/core/services";
import { useLoaderStore } from "@/stores";
import { SnackbarUtility } from "@/core/utilities";
import { orderReadAdapter } from "@/core/adapters";


export default function Order() {
    const navigate = useNavigate();
    const showLoader = useLoaderStore(state=>state.showLoader);
    const [orders, setOrders] = useState<Array<OrderReadDto>>([])

    const handleNewOrder = () => {
        navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.SALE}`, { replace: true })
    }

    const getOrders = async ()=>{
        showLoader(true)
        await OrdenService.get({pageIndex: 1, pageSize: 2}).then(response=>{
            setOrders(orderReadAdapter(response))           
        }).finally(()=>showLoader(false))
    }

    useEffect(()=>{
        getOrders();
    }, [])

    return (
        <Paper sx={{ maxWidth: "auto", margin: 'auto', overflow: 'hidden' }}>
            <AppBar
                position="static"
                color="default"
                elevation={0}
                sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
            >
                <Toolbar>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <SearchIcon color="inherit" sx={{ display: 'block' }} />
                        </Grid>
                        <Grid item xs>
                            {/* <TextField
                                fullWidth
                                placeholder="Search by email address, phone number, or user UID"
                                InputProps={{
                                    disableUnderline: true,
                                    sx: { fontSize: 'default' },
                                }}
                                variant="standard"
                            /> */}
                        </Grid>
                        <Grid item>
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
                </Toolbar>
            </AppBar>

            <OrderTable orders={orders} />

            {/* <Typography sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">
      No users for this project yet
    </Typography> */}
        </Paper>
    )
}
