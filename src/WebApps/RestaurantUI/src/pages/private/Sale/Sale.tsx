
import { ErrorBoundary } from "@/core/utilities";
import { Button, Grid } from "@mui/material";
import { useAsync, useFetchAndLoad, useMobileDetect } from "@/hooks";
import { ItemService, SaleService, getEstabs } from "@/core/services";
import CustomBottomNavigation from "./components/CustomBottomNavigation";
import { useSaleStore, useAuthStore } from "@/stores";
import { useEffect, useState } from "react";
import { itemReadAdapter } from "@/core/adapters";
import FullScreenDialog from "@/core/components/FullScreenDialog";
import { ArrowBackIcon, Checkout } from "@/core/components";
import ItemList from "./Item/ItemList";
import Category from "./Category/Category";
import Cart from "./Cart/Cart";
import CartMobile from "./Mobile/CartMobile";
import InputSearchItem from "./InputSearchItem/InputSearchItem"; 
import TableDialog from "./Table/TableDialog";



export default function Sale() {
    const { isMobile } = useMobileDetect();

    const setDataForm = useSaleStore(state => state.setDataForm)
    const { order, setSummary } = useSaleStore(state => ({
        order: state.order,
        setSummary: state.setSummary,
    }))


    const setDataEstab = useAuthStore(state => state.setDataEstab);
    const { itemSearch, setCollectionItems } = useSaleStore(state => ({
        itemSearch: state.itemSearch,
        setCollectionItems: state.setCollectionItems
    }));

    //Event Payment 
    const payment = useSaleStore(state => state.payment);

    //Even Navigation 
    const navigation = useSaleStore(state => state.navigation);

    //Modal Tables 
    const [openTableDialog, setOpenTableDialog] = useState(false);
    
    useEffect(() => {
        const establecimientos = getEstabs();
        const dataEstab = establecimientos[0]!;
        setDataEstab(establecimientos, dataEstab);

        SaleService.getDataForForm(JSON.stringify({
            codEstab: dataEstab?.codEstab
        })).then(response => {
            const warehouseData = response.warehouses.filter(
                warehouse => warehouse.codEstab_Asig === dataEstab.codEstab_Asig
            ).find(warehouse => (warehouse.defaultBodega));

            const emissionPointData = response.emissionPoints.filter(
                emissionPoint => emissionPoint.codEstab_Asig === dataEstab.codEstab_Asig
            ).find(emissionPoint => (emissionPoint.predeterminado));

            setSummary({
                ...order,
                establecimientoId: dataEstab.idEstablecimiento,
                puntoEmisionId: emissionPointData?.idPuntoEmision ?? 0,
                bodegaId: warehouseData?.idBodega ?? 0
            }
            )
            setDataForm(response)
        })
    }, [])


    //Fetch 
    const { loading, callEndpoint } = useFetchAndLoad();
    const getItemsApi = async () => await callEndpoint(ItemService.getAll(itemSearch));

    const itemAdapter = (response: any) => {
        setCollectionItems([])
        const items = itemReadAdapter(response.items || []);
        
        setCollectionItems(items)
    }

    //se ejecuta cada vez que cambian la categoria
    useAsync(getItemsApi, itemAdapter, () => {
        console.log('init')
    }, [itemSearch]);

    return (
        <ErrorBoundary fallBackComponent={<>Error!</>}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                    <Grid item xs={12} md={12} lg={12}>
                        <InputSearchItem />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Category />
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <ItemList loading={loading} />
                    </Grid>
                </Grid>
                <Grid item xs={12} md={5}>
                    {
                        isMobile ? <></> : <Cart />
                    }

                </Grid>
            </Grid>

            {/* start dialog payment */}
            {
                payment.isOpen && <Checkout open={payment.isOpen} closeDialog={payment.closeDialogCustom} />
            }
            {/* <FullScreenDialog
                color="inherit"
                icon={<CloseIcon />}
                dialogTitle="Cobro"
                isOpen={payment.isOpen}
                handleClose={payment.closeDialogCustom}
                actions={
                    <Button variant="contained">Cerrar</Button>
                }
            >
                <Checkout />
            </FullScreenDialog> */}
            {/* end dialog payment */}

            {/* start Items carito movil */}
            <FullScreenDialog
                color="inherit"
                icon={<ArrowBackIcon />}
                isOpen={navigation.isOpen}
                actions={
                    (
                        <>
                            <Button variant="outlined" onClick={() => {
                                setOpenTableDialog(true)
                            }}>
                                {
                                    order.tableId > 0 ? (
                                        (
                                            order.table?.tableName && order.table?.tableName
                                        ) ? `${order.table?.tableName} - ${order.table?.numberTable}` : 'Seleccionar Mesa'
                                    ) : 'Seleccionar Mesa'
                                }
                            </Button>
                            <TableDialog open={openTableDialog} onClose={setOpenTableDialog} />
                        </>
                    )
                }
                handleClose={navigation.closeDialogCustom}>
                <CartMobile />
                {/* <Cart /> */}
            </FullScreenDialog>
            {/* end Items carito movil */}

            <CustomBottomNavigation />
            {/* <KeyCombinationDetector /> */}
        </ErrorBoundary>
    );
}
