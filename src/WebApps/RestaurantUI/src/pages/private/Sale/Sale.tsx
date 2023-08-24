
import { ErrorBoundary, SnackbarUtility } from "@/core/utilities";
import { Grid, useMediaQuery } from "@mui/material";
import CategoryTab from "./components/CategoryTab";
import { useAsync, useFetchAndLoad } from "@/hooks";
import { ItemService, OrdenService, SaleService } from "@/core/services";
import CollectionItem from "./components/CollectionItem";
import SaleRight from "./components/SaleRight";

import { Establecimiento } from "@/core/models";
import CustomBottomNavigation from "./components/CustomBottomNavigation";
import { useSaleStore, useAuthStore, useCheckoutStore } from "@/stores";
import { useEffect } from "react";
import { itemReadAdapter, itemToApi, summaryToApi, warehouseAdapter } from "@/core/adapters";
import FullScreenDialog from "@/core/components/FullScreenDialog";
import { CloseIcon, SwipeLeftIcon } from "@/core/components";
import Checkout from "./components/Payment/Checkout";
import Swal from "sweetalert2";



export default function Sale() {
    const isMobile = useMediaQuery('(max-width:900px)');

    const setDataForm = useSaleStore(state => state.setDataForm)
    const { summary, setSummary } = useSaleStore(state => ({
        summary: state.summary,
        setSummary: state.setSummary,
    }))
    const dataForm = useSaleStore(state => state.dataForm);
    const items = useSaleStore(state => state.items);

    const setDataEstab = useAuthStore(state => state.setDataEstab);
    const dataEstab = useAuthStore(state => state.dataEstab);
    const estabs = useAuthStore(state => state.estabs);

    const { itemSearch, setCollectionItems } = useSaleStore(state => ({
        itemSearch: state.itemSearch,
        setCollectionItems: state.setCollectionItems
    }));

    //Event Payment 
    const payment = useSaleStore(state => state.payment);

    //Even Navigation 
    const navigation = useSaleStore(state => state.navigation);

    //Checkout
    const checkout = useCheckoutStore(state => state.checkout);


    useEffect(() => {
        const dataEstab = estabs[0] as Establecimiento
        setDataEstab(dataEstab)
        SaleService.getDataForForm(JSON.stringify({
            codEstab: dataEstab.codEstab
        })).then(response => {
            const warehouseData = response.warehouses.filter(
                warehouse => warehouse.codEstab_Asig === dataEstab.codEstab_Asig
            ).find(warehouse => (warehouse.defaultBodega));

            const emissionPointData = response.emissionPoints.filter(
                emissionPoint => emissionPoint.codEstab_Asig === dataEstab.codEstab_Asig
            ).find(emissionPoint => (emissionPoint.predeterminado));

            setDataForm(response)
            setSummary({
                ...summary,
                establecimientoId: dataEstab.idEstablecimiento,
                puntoEmisionId: emissionPointData?.idPuntoEmision ?? 0,
                bodegaId: warehouseData?.idBodega ?? 0
            }
            )
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


    const saveSale = async () => {
        const { isConfirmed } = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        })

        if(!isConfirmed) return
        const summaryResult = summaryToApi(summary);
        const itemsResult = itemToApi(items);
        const taxesResult = items.map(item=>item.taxes);
        const payments = {
            formaPagoId: dataForm.paymentTypes.find(pay=>pay.code==="EFE")?.paymentTypeId,
            total: checkout.voucher.payingAmount,
            abono: checkout.voucher.receivedAmount,
            cambio: checkout.voucher.changeReturn
        }
        const data = {
            ...summaryResult,
            items: itemsResult,
            taxes: taxesResult,
            payments
        }
        OrdenService.post(data).then(response => {
            console.log(response)
            if (response.code === '0') {
                SnackbarUtility.warning(response.message)
            }
            if (response.code === "1") {
                SnackbarUtility.success(response.message)
                // resetForm();
            }
        })
    }

    return (
        <ErrorBoundary fallBackComponent={<>Error!</>}>

            <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                    <Grid item xs={12} md={12}>
                        <CategoryTab />
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <CollectionItem loading={loading} />
                    </Grid>
                </Grid>
                <Grid item xs={12} md={5}>
                    {
                        isMobile ? <></> : <SaleRight />
                    }

                </Grid>
            </Grid>

            {/* start dialog payment */}
            <FullScreenDialog
                icon={<CloseIcon />}
                dialogTitle="Cobro"
                isOpen={payment.isOpen}
                handleClose={payment.closeDialogCustom}
            >
                <Checkout saveSale={saveSale} />
            </FullScreenDialog>
            {/* end dialog payment */}

            {/* start Items carito movil */}
            <FullScreenDialog icon={<SwipeLeftIcon />} dialogTitle="Carito" isOpen={navigation.isOpen} handleClose={navigation.closeDialogCustom}>
                <SaleRight />
            </FullScreenDialog>
            {/* end Items carito movil */}

            <CustomBottomNavigation isMobile={isMobile} />

        </ErrorBoundary>
    );
}
