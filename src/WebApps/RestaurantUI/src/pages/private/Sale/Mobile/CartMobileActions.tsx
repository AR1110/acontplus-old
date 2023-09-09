import * as React from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import { RemoveIcon } from '@/core/components/IconsMaterial';
import { useCheckoutStore, useLoaderStore, useSaleStore } from '@/stores';
import { DOC_TYPE } from '@/core/constants';
import { SnackbarUtility } from '@/core/utilities';
import { itemToApi, summaryToApi } from '@/core/adapters';
import { OrdenService, SharedService } from '@/core/services';
import { QueryParams } from '@/core/models';
import Swal from 'sweetalert2';

const actions = [
    { icon: <FileCopyIcon color='warning' />, codDoc: "NE", name: 'Nota Entrega' },
    { icon: <FileCopyIcon color='primary' />, codDoc: "FV", name: 'Factura' },
    { icon: <SaveIcon color='success' />, codDoc: "OR", name: 'Guardar' },
    { icon: <RemoveIcon color='success' />, codDoc: "D", name: 'Guardar' },
];

export default function CartMobileAction() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(!open);
    const handleClose = () => setOpen(false);

    const cartItems = useSaleStore(state => state.items);
    const { order } = useSaleStore(state => ({
        order: state.order,
        items: state.items,
    }));

    //store checkout 
    const setQueryParams = useCheckoutStore(state => state.setQueryParams)

    const resetForm = useSaleStore(state => state.resetForm);
    const payment = useSaleStore(state => state.payment);

    const { showLoader } = useLoaderStore();

    //Even Navigation 
    const navigation = useSaleStore(state => state.navigation);

    const typeActions: { [key: string]: string } = {
        [DOC_TYPE.FV]: `
        Esta seguro de guardar el pedido como Factura? </br> 
        <small>Ya no será posible modificar la venta para hacer cambios, tendrás que cancelar esta y crear una nueva.!</small>`,
        [DOC_TYPE.NE]: `
        Esta seguro de guardar el pedido como Nota de Entrega? </br> 
        <small>Ya no será posible modificar la venta para hacer cambios, tendrás que cancelar esta y crear una nueva.!</small>`,
        [DOC_TYPE.OR]: `Esta seguro de guardar el pedido? </br>
        <small>El stock de los productos <strong>no se descontará</strong> hasta que se transforme a "Factura" o "Nota de Entrega".`

    }

    const handleTypeAction = (codDoc: string) => {
        if (codDoc === DOC_TYPE.OR) {
            resetForm();
            navigation.closeDialogCustom();
            return
        }
        setOpen(false);
        askToSave(codDoc);
    }

    const askToSave = async function (codDoc: string) {
        if (!(order.tableId > 0)) {
            SnackbarUtility.warning('Seleccione la Mesa');
            return
        }
        if (cartItems.length === 0) {
            SnackbarUtility.warning('Agregue Item');
            return
        }
        const { isConfirmed } = await Swal.fire({
            title: `${order.orderId > 0 ? 'Actualizar' : 'Guardar'} Pedido`,
            html: typeActions[codDoc],
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `${order.orderId > 0 ? 'Actualizar' : 'Guardar'}`,
            cancelButtonText: 'No, cancelar!'
        })

        if (!isConfirmed) return

        const summaryResult = summaryToApi(order);
        const itemsResult = itemToApi(cartItems);
        const taxesResult = cartItems.flatMap(item => item.taxes);
        // const payments = {
        //     formaPagoId: dataForm.paymentTypes.find(pay=>pay.code==="EFE")?.paymentTypeId,
        //     total: checkout.voucher.payingAmount,
        //     abono: checkout.voucher.receivedAmount,
        //     cambio: checkout.voucher.changeReturn
        // }
        const data = {
            ...summaryResult,
            updateOrder: (order.orderId > 0) && codDoc === DOC_TYPE.OR,
            saveDoc: (codDoc === DOC_TYPE.FV) || (codDoc === DOC_TYPE.NE),
            codDoc,
            quickSale: (codDoc === DOC_TYPE.FV) || (codDoc === DOC_TYPE.NE),
            items: itemsResult,
            taxes: taxesResult,
            payments: {}
        }
        if (order.orderId > 0) {
            showLoader(true);
            OrdenService.put(order.orderId, data).then(response => {
                navigation.closeDialogCustom();
                if (response.code === '0') {
                    SnackbarUtility.warning(response.message)
                }
                if (response.code === "1") {
                    SnackbarUtility.success(response.message);
                    const queryParams: QueryParams = JSON.parse(response.payload)[0];
                    console.log(queryParams)
                }
            }).finally(() => showLoader(false))
        } else {
            showLoader(true);
            OrdenService.post(data).then(response => {
                showLoader(false)
                navigation.closeDialogCustom();
                if (response.code === '0') {
                    SnackbarUtility.warning(response.message)
                }
                if (response.code === "1") {
                    SnackbarUtility.success(response.message);

                    //Order 
                    if (codDoc === DOC_TYPE.OR) {
                        resetForm();

                        return
                    }
                    const queryParams: QueryParams = JSON.parse(response.payload)[0];

                    if (queryParams.payAutomatic) {
                        setQueryParams(queryParams);
                        payment.openDialogCustom();
                        return
                    }


                    if (queryParams.printerAutomatic) {
                        SharedService.getPrinter(1)
                    } else {
                        resetForm();
                    }
                }
            }).finally(() => showLoader(false))
        }


    }

    return (


        <SpeedDial
            ariaLabel="SpeedDial tooltip example"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
            onClose={handleClose}
            onClick={handleOpen}
            open={open}
        >
            {actions.map((action, key) => (
                <SpeedDialAction
                    key={key}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    tooltipOpen
                    onClick={() => handleTypeAction(action.codDoc)}
                />
            ))}
        </SpeedDial>

    );
}
