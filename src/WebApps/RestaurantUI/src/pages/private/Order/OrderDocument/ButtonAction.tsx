
import { PaymentsIcon, PrintIcon, SaveAltSharpIcon, ShareSharpIcon } from '@/core/components/IconsMaterial';
import WhatsApp from '@/core/components/WhatsApp/WhatsApp';
import { DOC_TYPE, DOC_TYPE_REPORT } from '@/core/constants';
import { IOrderDocument } from '@/core/models';
import { SharedService } from '@/core/services';
import { Button, Stack, Tooltip } from '@mui/material';
import { lazy, useState } from 'react'
import Swal from 'sweetalert2';

const Checkout = lazy(() => import("@/core/components/Checkout/Checkout"));
type ActionsProps = {
    data: IOrderDocument,
    getOrderDocuments: () => void
}
const ButtonAction = ({ data, getOrderDocuments }: ActionsProps) => {
    const [loadingPDF, setLoadingPDF] = useState(false);
    const [openDialogWhatsApp, setDialogWhatsApp] = useState(false);
    const [openCheckout, setOpenCheckout] = useState(false)

    const documentReport = () => {
        try {
            const format = 'pdf';
            const dataParms = {
                id: data.documentoId,
                //Factura
                format,
                codEstab: data.codEstab,
            }

            if (data.docType === DOC_TYPE.NE) {
                setLoadingPDF(true)
                const parameters = {
                    hasService: true,
                    reportParams: JSON.stringify({
                        hasParams: true,
                        codigo: DOC_TYPE_REPORT.NE,
                        codEstab: data.codEstab,
                        format,
                        aditionalParams: []
                    }),
                    dataParams: JSON.stringify(dataParms)
                }
                SharedService.downloadExternal(parameters)
                    .finally(() => setLoadingPDF(false));
            }

            if (data.docType === DOC_TYPE.FV) {
                setLoadingPDF(true);
                const parameters = {
                    hasService: true,
                    reportParams: JSON.stringify({
                        hasParams: true,
                        codigo: DOC_TYPE_REPORT.FV,
                        codEstab: data.codEstab,
                        format,
                        aditionalParams: []
                    }),
                    dataParams: JSON.stringify(dataParms)
                }
                SharedService.downloadExternal(parameters)
                    .finally(() => setLoadingPDF(false));
            }
        } catch (error) {
            console.log(error)
            setLoadingPDF(false)
        }
    }

    const documentPrint = () => {
        try {
            if (data.docType === DOC_TYPE.FV) {
                SharedService.askToPrint({
                    id: data.orderId,
                    documentoId: data.documentoId,
                    tipo: 3
                })
            }
            if (data.docType === DOC_TYPE.NE) {
                SharedService.askToPrint({
                    id: data.orderId,
                    documentoId: data.documentoId,
                    tipo: 4
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleClickBtnDialogWhatsApp = () => {
        setDialogWhatsApp(true)
    }

    const closeDialogWhatsApp = () => {
        setDialogWhatsApp(false)
    }

    const openCheckoutDialog = () => {
        if (["A"].includes(data.codEstado)) {
            Swal.fire({
                icon: 'warning',
                html: 'Este documento ya esta anulado!'
            })
        }

        if (["CBR"].includes(data.codEstado)) {
            Swal.fire({
                icon: 'warning',
                html: 'Este documento ya ha sido cobrado!'
            })
            return
        }
        setOpenCheckout(true)
    }
    const closeCheckoutDialog = (action: string) => {
        if (action === "REFRESH") {
            getOrderDocuments()
        }
        setOpenCheckout(false)
    }

    return (
        <>
            <Stack direction="row"
                spacing={1}>
                <Button
                    variant="contained"
                    color="primary"
                    size='small'
                    onClick={documentPrint} >
                    <PrintIcon />
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    size='small'
                    disabled={loadingPDF}
                    onClick={documentReport} >
                    <SaveAltSharpIcon />
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    size='small'
                    onClick={handleClickBtnDialogWhatsApp} >
                    <ShareSharpIcon />
                </Button>
                <Tooltip title="Cobro">
                    <Button
                        variant="contained"
                        color="warning"
                        size='small'
                        onClick={openCheckoutDialog}
                    >
                        <PaymentsIcon />
                    </Button>
                </Tooltip>
            </Stack>
            {
                openDialogWhatsApp && <WhatsApp data={data} open={openDialogWhatsApp} setOpen={closeDialogWhatsApp} />
            }

            {
                openCheckout && <Checkout open={openCheckout} closeDialog={closeCheckoutDialog} params={{
                    codEstab: data.codEstab,
                    idCuentaPorCobrar: data.idCuentaPorCobrar,
                    tiempoCredito: data.tiempoCredito
                }} />
            }


        </>
    )
}

export default ButtonAction