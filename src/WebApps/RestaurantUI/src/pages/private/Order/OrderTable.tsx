import * as React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ChangeEvent, lazy, useRef, useState } from "react";
import { Button, IconButton, Tooltip } from "@mui/material";

import {
    AccountTreeIcon,
    ArrowBackIcon,
    AspectRatioIcon,
    EditIcon,
} from "@/core/components/IconsMaterial";
import { orderService } from "@/core/services";
import { useLoaderStore, useOrderStore, useSaleStore } from "@/stores";
import { PrivateRoutes } from "@/core/models";
import { orderReadForUpdateAdapter } from "@/core/adapters";
import FullScreenDialog from "@/core/components/FullScreenDialog";
import { SplitOrderProvider } from "./context";
import OrderDocument from "./OrderDocument/OrderDocument";
const SplitOrder = lazy(() => import("./SplitOrder/SplitOrder"));

export default function OrderTable() {
    const navigate = useNavigate();
    const orders = useOrderStore(state => state.orders);
    const getOrders = useOrderStore(state => state.getOrders);
    const orderFilter = useOrderStore(state => state.orderFilter);
    const setOrderFilter = useOrderStore(state => state.setOrderFilter);

    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(25);
    const showLoader = useLoaderStore((state) => state.showLoader);
    const setDataEdit = useSaleStore((state) => state.setDataEdit);
    const [openDialodDivide, setOpenDialodDivide] = useState(false);

    const [openDocument, setOpenDocument] = useState(false)

    const setOrderId = useRef(0);

    const handleChangePage = (_: unknown, newPage: number) => {

        setOrderFilter({
            ...orderFilter,
            pageIndex: newPage + 1
        })
        setPage(newPage);
        getOrders()
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        const pageSize = parseInt(event.target.value, 10)
        setOrderFilter({
            ...orderFilter,
            pageSize
        })
        setRowsPerPage(pageSize);
        setPage(0)
        getOrders()
    };

    // const handleAskToPrint = async (data: typeof orders[0]) => {
    //     console.log(data)
    //     try {
    //         const {isConfirmed, isDenied} = await Swal.fire({
    //             icon: 'warning',
    //             text: 'Seleccione el tipo documento a imprimir!',
    //             showDenyButton: data.documentoId > 0,
    //             showCancelButton: true,
    //             confirmButtonText: 'Pedido',
    //             denyButtonText: `Documento`,
    //             cancelButtonText: 'Cancelar'
    //         })

    //         //Pedido 
    //         if(isConfirmed){
    //             SharedService.getPrinter(data.orderId)
    //         }

    //         //Documento 
    //         if(isDenied){
    //             SharedService.getPrinter(data.orderId)
    //         } 
    //     } catch (error) {
    //         console.log(error)
    //     }
    // };


    // const handleReport = async (data: typeof orders[0]) => {
    //     console.log(data)
    //     try {
    //         const { isConfirmed, isDenied } = await Swal.fire({
    //             icon: 'warning',
    //             text: 'Seleccione el tipo documento para generar reporte!',
    //             showDenyButton: data.documentoId > 0,
    //             showCancelButton: true,
    //             confirmButtonText: 'Pedido',
    //             denyButtonText: `Documento`,
    //             cancelButtonText: 'Cancelar'
    //         })

    //         if (isDenied) {
    //             const format = 'pdf';
    //             const dataParms = {
    //                 id: data.documentoId,
    //                 //Factura
    //                 format,
    //                 codEstab: data.codEstab,
    //             }

    //             if (data.codDoc === DOC_TYPE.NE) {
    //                 showLoader(true)
    //                 const parameters = {
    //                     hasService: true,
    //                     reportParams: JSON.stringify({
    //                         hasParams: true,
    //                         codigo: 'RNE',
    //                         codEstab: data.codEstab,
    //                         format,
    //                         aditionalParams: []
    //                     }),
    //                     dataParams: JSON.stringify(dataParms)
    //                 }
    //                 SharedService.downloadExternal(parameters)
    //                     .finally(() => showLoader(false));
    //             }

    //             if (data.codDoc === DOC_TYPE.FV) {
    //                 showLoader(true)
    //                 const parameters = {
    //                     dataParams: JSON.stringify({
    //                         ...dataParms,
    //                         codigo: 'RF'
    //                     })
    //                 }
    //                 SharedService.downloadDynamicExternal(parameters)
    //                     .finally(() => showLoader(false));
    //             }
    //         }
    //         if (isConfirmed) {
    //             showLoader(true)
    //             SharedService.downloadReport(data.orderId)
    //                 .finally(() => showLoader(false));
    //         }

    //     } catch (error) {
    //         console.log(error)
    //     }

    // };

    const handleEdit = (orderId: number) => {
        showLoader(true);
        orderService.get({
            id: orderId,
            tipo: 2,
        })
            .then(async (response) => {
                const data = await orderReadForUpdateAdapter(response);
                setDataEdit(data);
                navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.SALE}`, {
                    replace: true,
                });
            })
            .finally(() => showLoader(false));
    };


    const dividerCuenta = (id: number) => {
        setOrderId.current = id;
        setOpenDialodDivide(true)
    }

    function closeDialogDivide<T>(value: T) {
        if (typeof value === 'string' && value === 'CUSTOM_DETAIL') {
            getOrders()
        }
        setOpenDialodDivide(false)
    }

    function closeOrderDocument() {
        setOpenDocument(false)
    }

    return (
        <React.Fragment>
            <Box sx={{ width: "100%" }}>
                <Paper sx={{ width: "100%" }}>
                    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                        <Table
                            sx={{ minWidth: 650 }}
                            aria-label="simple table"
                            stickyHeader
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>N°</TableCell>
                                    <TableCell>Op.</TableCell>
                                    <TableCell align="center">Nro. Doc</TableCell>
                                    <TableCell align="center">F. Emisión</TableCell>
                                    <TableCell align="center">Cliente</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                    {/* <TableCell align="center">Estado</TableCell> */}
                                    <TableCell align="center">Usuario</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>
                                            {/* {!(order.documentoId > 0) && (
                                                <Tooltip describeChild title="Transformar a NE O FV">
                                                    <IconButton color="info"
                                                        aria-label="delete"
                                                        onClick={() => handleClickOpen(order.orderId)}
                                                    >
                                                        <MoveUpIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )} */}
                                            {/* <IconButton
                                                aria-label="delete"
                                                color="error"
                                                onClick={() => handleUpdateState(order.orderId)}
                                            >
                                                <DeleteIcon />
                                            </IconButton> */}
                                            {
                                                order.documentoId > 0 ? '' : (<>
                                                    {
                                                        !(order.divided) && (
                                                            <Tooltip describeChild title="Editar">
                                                                <Button variant="contained" color="success"
                                                                    aria-label="Editar"
                                                                    onClick={() => handleEdit(order.orderId)}
                                                                >
                                                                    <EditIcon />
                                                                </Button>
                                                            </Tooltip>
                                                        )
                                                    }
                                                </>)
                                            }

                                            <Tooltip describeChild title="Impresión">
                                                <Button variant="contained" color="primary"
                                                    aria-label="Impresión"
                                                    onClick={() => {
                                                        setOrderId.current = order.orderId;
                                                        setOpenDocument(true)
                                                    }}
                                                >
                                                    <AspectRatioIcon />
                                                </Button>
                                            </Tooltip>

                                            {/* <Tooltip describeChild title="Descargar PDF">
                                                <IconButton size="large" color="secondary"
                                                    aria-label="Impresión"
                                                    onClick={() => handleReport(order)}
                                                >
                                                    <SaveAltSharpIcon />
                                                </IconButton>
                                            </Tooltip> */}

                                            {/* <Tooltip describeChild title="Compartir por WhatsApp">
                                                <IconButton size="large" color="success"
                                                    aria-label="Impresión"
                                                    onClick={() => setOpenTableDialog(true)}
                                                >
                                                    <ShareSharpIcon />
                                                </IconButton>
                                            </Tooltip> */}

                                            {
                                                (!(order.documentoId > 0) || (order.divided)) && (
                                                    <Tooltip describeChild title="Dividir la cuenta">
                                                        <Button variant="contained" size="large" color="inherit"
                                                            aria-label="Impresión"
                                                            onClick={() => dividerCuenta(order.orderId)}
                                                        >
                                                            <AccountTreeIcon />
                                                        </Button>
                                                    </Tooltip>
                                                )
                                            }

                                        </TableCell>
                                        <TableCell align="center"> {order.serie}</TableCell>
                                        <TableCell align="center">{order.createdAt}</TableCell>
                                        <TableCell align="center">{order.nameFiscal}</TableCell>
                                        <TableCell align="right">{order.total}</TableCell>
                                        {/* <TableCell align="center">{order.divided ? 'Dividiendo' : '-'}</TableCell> */}
                                        <TableCell align="center">{order.userName}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50, 100]}
                        component="div"
                        count={orders[0]?.totalRecords ?? 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>

            {/* <OrderConvertDoc
                open={open}
                handleClose={handleClose}
            /> */}

            {/* { End list  - TABLE } */}
            {/* <OrderWhatsApp
                open={openTableDialog}
                onClose={setOpenTableDialog} /
            > */}

            {/* Dividir Cuenta  */}
            <FullScreenDialog
                color="primary"
                icon={<ArrowBackIcon />}
                isOpen={openDialodDivide}
                actions={<>Dividir Cuenta</>}
                handleClose={closeDialogDivide}>
                <SplitOrderProvider>
                    <SplitOrder id={setOrderId.current} closeDialogDivide={closeDialogDivide} />
                </SplitOrderProvider>
            </FullScreenDialog>


            {/* Modal Order Document */}

            {
                openDocument && <OrderDocument id={setOrderId.current} open={openDocument} setOpen={closeOrderDocument} />
            }



        </React.Fragment>
    );
}
