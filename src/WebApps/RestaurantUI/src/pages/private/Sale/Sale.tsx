
import { ErrorBoundary } from "@/core/utilities";
import { Button, Grid } from "@mui/material";
import { useMobileDetect } from "@/hooks";
import { SaleService, getEstabs } from "@/core/services";
import CustomBottomNavigation from "./components/CustomBottomNavigation";
import { useSaleStore, useAuthStore } from "@/stores";
import { lazy, useEffect, useState } from "react"; 
import FullScreenDialog from "@/core/components/FullScreenDialog";
import Category from "./Category/Category";
import Cart from "./Cart/Cart";
import CartMobile from "./Mobile/CartMobile";
import InputSearchItem from "./InputSearchItem/InputSearchItem";
import TableDialog from "./Table/TableDialog";
import { ArrowBackIcon } from "@/core/components/IconsMaterial"; 
import ItemContent from "./Item/ItemContent";
import useFetchItems from "./hooks/useFetchItems.hook"; 
const Checkout = lazy(() => import("@/core/components/Checkout/Checkout"));

export default function Sale() {
    const { isMobile } = useMobileDetect();

    const setDataForm = useSaleStore(state => state.setDataForm)
    const { order, setSummary, resetForm } = useSaleStore(state => ({
        order: state.order,
        setSummary: state.setSummary,
        resetForm: state.resetForm
    }))

    const { loading, fetchItem } = useFetchItems()

    const setDataEstab = useAuthStore(state => state.setDataEstab);
    const setPuntoEmision = useAuthStore(state => state.setPuntoEmision);
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
            })
            if(emissionPointData){
                setPuntoEmision(emissionPointData.ptoEmi)
            }
            setDataForm(response)
        })

        return ()=>{
            resetForm();
        }
    }, [])

    useEffect(() => {
        
        setCollectionItems([])
        fetchItem(itemSearch).then(response => {
            setCollectionItems(response)
        })
    }, [])


    return (
        <ErrorBoundary fallBackComponent={<>Error!</>}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                    <Grid item xs={12} md={12} lg={12}>
                        <InputSearchItem />
                        {/* <Grid container spacing={1}>
                            <Grid item xs={12} md={10} lg={10}>
                                <InputSearchItem />
                            </Grid>
                            <Grid item xs={12} md={2} lg={2}>
                                <Button variant="contained"   size="large" fullWidth>Promoción</Button>
                            </Grid>
                        </Grid> */}
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Category />
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <ItemContent loading={loading} />
                        {/* <ItemList loading={loading} /> */}
                    </Grid>
                </Grid>
                <Grid item xs={12} md={5}>
                    {
                        isMobile ? "" : <Cart />
                    }

                </Grid>
            </Grid>

            {/* start dialog payment */}
            {
                payment.isOpen && <Checkout open={payment.isOpen} closeDialog={payment.closeDialogCustom} params={payment.params} />
            }
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
                                        ) ? `${order.table?.tableName}` : 'Seleccionar Mesa'
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
