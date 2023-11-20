import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer'; 
import { Card, CardContent, Divider, Grid, IconButton, MenuItem, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import { CloseIcon } from '@/core/components/IconsMaterial'; 
import { useSaleStore, useStoreCartSidebar } from '@/stores';
import { useEffect } from 'react';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

function CartSidebar() {  
    const { openCartSidebar, setOpenCartSidebar, data, index, setDataItem } = useStoreCartSidebar(state => ({
        openCartSidebar: state.openCartSidebar,
        setOpenCartSidebar: state.setOpenCartSidebar,
        data: state.data,
        index: state.index,
        setDataItem: state.setDataItem
    })); 
    const { order} = useSaleStore(state => ({
        order: state.order 
    }));
    const setChangeValueOrderItem = useSaleStore(state => state.setChangeValueOrderItem);
    const onChangePVP = useSaleStore(state => state.onChangePVP);
    const onChangeMeasure = useSaleStore(state => state.onChangeMeasure);
    const {pvps, measures} = data;
 
    const isMdUp = useMediaQuery((theme:any) => theme.breakpoints.up('md'));

    const drawerWidth = isMdUp ? 450 : 350; 
    
    useEffect(()=>{

        return()=>{
            setDataItem({
                pvps: [],
                measures: []
            }, index)
        }
    }, [])
    const list = (anchor: Anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : drawerWidth, p: 1 }}
            role="presentation"
        // onClick={toggleDrawer(anchor, false)}
        // onKeyDown={toggleDrawer(anchor, false)}
        >
            <Card variant="outlined">
                <Box sx={{ my: 1, mx: 1 }}>
                    <Grid container alignItems="center">
                        <Grid item xs>
                            <IconButton aria-label="delete" onClick={() => setOpenCartSidebar(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <Typography gutterBottom variant="h6" component="div">
                                ${order.total}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Divider variant="middle" />
                {/* <CardHeader
                    action={
                        <IconButton aria-label="close" color='info' size='large'>
                            <CloseIcon />
                        </IconButton>
                    }
                /> */}
                <CardContent>
                    <Stack
                        component="form"
                        spacing={2}
                        noValidate
                        autoComplete="off"
                    >
                        {
                            measures && measures.length > 0 && (
                                <TextField
                                    id="medida"
                                    select
                                    label="Medida"
                                    value={data.measureId}
                                    fullWidth
                                    size='small'
                                    onChange={(e) => {
                                        const measureId = Number(e.target.value);
                                        const dataMeasure = data.measures.find(m => (m.measureId === measureId));
                                        let feeId = 0;
                                        if(dataMeasure){
                                            const dataPVP = dataMeasure.pvps.find(pvp => (pvp.default));
                                            feeId = dataPVP && dataPVP.feeId || 0
                                        }
                                        
                                        onChangeMeasure(measureId, index)
                                        setDataItem({
                                            ...data,
                                            feeId,
                                            pvps: dataMeasure && dataMeasure.pvps || [],
                                            measureId: measureId
                                        }, index)
                                    }}
                                >
                                    {
                                        measures && measures.map((medida, index: number) => (
                                            <MenuItem key={index} value={medida.measureId}>
                                                {medida.description}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>
                            )
                        }

                        {
                            pvps && pvps.length > 0 && (
                                <TextField fullWidth
                                    size='small'
                                    id="pvps"
                                    name="pvps"
                                    value={data.feeId}
                                    label="Tarifa"
                                    select
                                    onChange={(e) =>{
                                        const idTarifa = Number(e.target.value);
                                        onChangePVP(idTarifa, index)
                                        setDataItem({
                                            ...data,
                                            feeId: idTarifa
                                        }, index)
                                    }}
                                >
                                    {
                                        pvps.map((pvp, index) => (
                                            <MenuItem value={pvp.feeId} key={index}>
                                                {pvp.description} - ${pvp.priceWithVat}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>
                            )
                        }

                        {/* <TextField
                            id="tipoIva"
                            select
                            label="Tipo Iva"

                            fullWidth
                            size='small'

                        >
                            {
                                [1, 2, 3, 4].map((usuario: any, index: number) => (
                                    <MenuItem key={index} value={usuario}>
                                        {usuario}
                                    </MenuItem>
                                ))
                            }
                        </TextField> */}

                        {/* <TextField type='number'
                            size="small" label="Descuento" variant="outlined" /> */}

                        <TextField
                            label="Comentario"
                            id="obs"
                            name="obs"
                            value={data.obs} 
                            multiline
                            fullWidth
                            onChange={(e) => {
                                const obs = e.target.value;
                                setChangeValueOrderItem(index, "obs", obs);
                                setDataItem({
                                    ...data,
                                    obs: obs
                                }, index)
                            }}
                        />
                    </Stack>


                </CardContent>
            </Card>
        </Box>
    );

    return (  
            <React.Fragment > 
                <Drawer
                sx={{
                    zIndex: 1300
                }} 
                    anchor="right"
                open={openCartSidebar}
                >
                    {list('right')}
                </Drawer>
            </React.Fragment> 
    );
}


export default CartSidebar;