import { PrintIcon, SaveAltSharpIcon, ShareSharpIcon } from '@/core/components/IconsMaterial';
import WhatsApp from '@/core/components/WhatsApp/WhatsApp';
import { DOC_TYPE, DOC_TYPE_REPORT } from '@/core/constants';
import { IOrderDocument } from '@/core/models';
import { SharedService } from '@/core/services';
import { Button } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useState } from 'react'
type ActionsProps = {
    data: GridRenderCellParams
}
const ButtonAction = ({ data }: ActionsProps) => {
    const [loadingPDF, setLoadingPDF] = useState(false);
    const [openDialogWhatsApp, setDialogWhatsApp] = useState(false);
    const row = data.row as IOrderDocument
    const documentReport = () => {
        try {
            const format = 'pdf';
            const dataParms = {
                id: row.documentoId,
                //Factura
                format,
                codEstab: row.codEstab,
            }

            if (row.docType === DOC_TYPE.NE) {
                setLoadingPDF(true)
                const parameters = {
                    hasService: true,
                    reportParams: JSON.stringify({
                        hasParams: true,
                        codigo: DOC_TYPE_REPORT.NE,
                        codEstab: row.codEstab,
                        format,
                        aditionalParams: []
                    }),
                    dataParams: JSON.stringify(dataParms)
                }
                SharedService.downloadExternal(parameters)
                    .finally(() => setLoadingPDF(false));
            }

            if (row.docType === DOC_TYPE.FV) {
                setLoadingPDF(true);
                const parameters = {
                    hasService: true,
                    reportParams: JSON.stringify({
                        hasParams: true,
                        codigo: DOC_TYPE_REPORT.FV,
                        codEstab: row.codEstab,
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
            if (row.docType === DOC_TYPE.FV) {
                SharedService.askToPrint({
                    id: row.orderId,
                    documentoId: row.documentoId,
                    tipo: 3
                })
            }
            if (row.docType === DOC_TYPE.NE) {
                SharedService.askToPrint({
                    id: row.orderId,
                    documentoId: row.documentoId,
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
    return (
        <>
            <Button
                variant="contained"
                color="primary"
                size='large'
                onClick={documentPrint}
                sx={{ ml: 1 }}>
                <PrintIcon />
            </Button>
            <Button
                variant="contained"
                color="secondary"
                size='large'
                disabled={loadingPDF}
                onClick={documentReport}
                sx={{ ml: 1 }}>
                <SaveAltSharpIcon />
            </Button>
            <Button
                variant="contained"
                color="success"
                size='large'
                onClick={handleClickBtnDialogWhatsApp}
                sx={{ ml: 1, mr: 1 }}>
                <ShareSharpIcon />
            </Button>

            {
                openDialogWhatsApp && <WhatsApp data={data.row} open={openDialogWhatsApp} setOpen={closeDialogWhatsApp} />
            }
        </>
    )
}

export default ButtonAction