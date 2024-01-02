

import React, { forwardRef, useEffect, useState } from 'react'
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    Slide,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { PrintIcon, SaveAltSharpIcon, ShareSharpIcon } from '@/core/components/IconsMaterial';
import { SharedService, orderService } from '@/core/services';
import { green } from '@mui/material/colors';
import ButtonAction from './ButtonAction';
import { IOrderDocument, OrderReadDto } from '@/core/models';
import WhatsApp from '@/core/components/WhatsApp/WhatsApp';
import { DOC_TYPE } from '@/core/constants';
import { hideLoader, showLoader } from '@/spinner';


const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} {...props} />;
});

type OrderDocumentProps = {
    data: OrderReadDto
    open: boolean,
    setOpen(): void
}


const OrderDocument = ({ data, open, setOpen }: OrderDocumentProps) => {
    const [loadingPDF, setLoadingPDF] = useState(false);
    const [orderDocuments, setOrderDocuments] = useState<Array<IOrderDocument & { index: number }>>([]);
    const [openDialogWhatsApp, setDialogWhatsApp] = useState(false);
    const id = data.orderId;

    let controller: AbortController;

    const closeModal = () => {
        setOpen();
    }

    const getOrderDocuments = async () => {
        try {
            showLoader();
            const dataFetch = orderService.getId(id, 3);

            if (dataFetch.controller) controller = dataFetch.controller;

            const resultAxios = await dataFetch.call;

            const response = resultAxios.data;
            setOrderDocuments(response.orderDocuments)

            hideLoader();
        } catch (error) {
            console.log(error)
            hideLoader()
        }
    }

    // Función para cancelar la solicitud de datos de pedido
    const cancelEndpoint = () => {
        controller && controller.abort();
    };

    useEffect(() => {
        getOrderDocuments();
        return () => {
            // Cancela la solicitud de datos de pedido al desmontar
            cancelEndpoint();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const printOrder = () => {
        try {
            SharedService.askToPrint({
                id,
                documentoId: 0,
                tipo: 2
            })
        } catch (error) {
            console.log(error)
        }
    }
    const reportOrderPDF = async () => {
        try {
            setLoadingPDF(true)
            const parameters = {
                dataParams: JSON.stringify({
                    id: id
                }),
                reportParams: JSON.stringify({
                    codEstab: data.codEstab,
                    codigo: "RRO",
                    format: "pdf",
                }),
            };
            SharedService.downloadExternal(parameters)
                .finally(() => setLoadingPDF(false));
        } catch (error) {
            setLoadingPDF(false)
            console.log(error)
        }
    };

    const handleClickBtnDialogWhatsApp = () => {
        setDialogWhatsApp(true)
    }

    const closeDialogWhatsApp = () => {
        setDialogWhatsApp(false)
    }

    return (
        <>
            <Dialog
                fullWidth={true}
                maxWidth="lg"
                TransitionComponent={Transition}
                keepMounted
                open={open}
            >
                <DialogTitle>
                    {"Orden Documento"}
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }} paddingBottom={2}>
                        <Grid item xs={12} sm={4} md={4}>
                            <Box sx={{ position: 'relative' }}>
                                <Button variant="contained" color='primary' fullWidth startIcon={<PrintIcon />} sx={{
                                    height: 60
                                }} onClick={printOrder}>
                                    Imprimir pedido
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            <Box sx={{ position: 'relative' }}>
                                <Button
                                    variant="contained"
                                    color='secondary'
                                    fullWidth
                                    // sx={buttonSx}
                                    disabled={loadingPDF}
                                    onClick={reportOrderPDF}
                                    startIcon={<SaveAltSharpIcon />} sx={{
                                        height: 60
                                    }}
                                >
                                    Pedido PDF
                                </Button>
                                {loadingPDF && (
                                    <CircularProgress
                                        size={24}
                                        sx={{
                                            color: green[500],
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            marginTop: '-12px',
                                            marginLeft: '-12px',
                                        }}
                                    />
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            <Box sx={{ position: 'relative' }}>
                                <Button variant="contained" color='success' fullWidth startIcon={<ShareSharpIcon />} sx={{
                                    height: 60
                                }} onClick={handleClickBtnDialogWhatsApp}>
                                    Compartir
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="medium" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>Op.</TableCell>
                                    <TableCell>N°.</TableCell>
                                    <TableCell>Tipo Doc.</TableCell>
                                    <TableCell>Nro. Doc.</TableCell>
                                    <TableCell>Fecha Emisión</TableCell>
                                    <TableCell>Cliente</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                    <TableCell align="right">Abono</TableCell>
                                    <TableCell align="right">Saldo</TableCell>
                                    <TableCell>Estado</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orderDocuments.map((row, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            <ButtonAction data={row} getOrderDocuments={getOrderDocuments} />
                                        </TableCell>
                                        <TableCell>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>{row.docType}</TableCell>
                                        <TableCell>{row.serie}</TableCell>
                                        <TableCell>{row.createAt}</TableCell>
                                        <TableCell>{row.customerName}</TableCell>
                                        <TableCell align="right">{row.importeTotal}</TableCell>
                                        <TableCell align="right">{row.abono}</TableCell>
                                        <TableCell align="right">{row.saldo}</TableCell>
                                        <TableCell>{row.estado}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* <StyledBox>
                        <DataGrid
                            sx={{
                                boxShadow: 2,
                                border: 2,
                                borderColor: 'primary.light',
                                '& .MuiDataGrid-cell:hover': {
                                    color: 'primary.main',
                                },
                            }}
                            //autoHeight
                            loading={loading}
                            rows={orderDocuments}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 5 },
                                },
                            }}
                            pageSizeOptions={[5, 10]}
                        />
                    </StyledBox> */}
                </DialogContent>
                <DialogActions>
                    <Button color='inherit' variant='outlined' sx={{
                        height: 60
                    }} size='large' fullWidth onClick={closeModal}>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
            {
                openDialogWhatsApp && <WhatsApp data={{
                    telefono: data.telefonoCliente,
                    documentoId: data.orderId,
                    docType: DOC_TYPE.OR,
                    codEstab: data.codEstab,
                    telefonoEstablecimiento: data.telefonoEstablecimiento,
                    nombreComercial: data.nombreComercialEstab
                }} open={openDialogWhatsApp} setOpen={closeDialogWhatsApp} />
            }
        </>
    )
}

export default OrderDocument
