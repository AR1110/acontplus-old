import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { lazy, useRef, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";

import {
    AccountTreeIcon,
    ArrowBackIcon,
    DeleteIcon,
    EditIcon,
    MoveUpIcon,
    PrintIcon,
    SaveAltSharpIcon,
    ShareSharpIcon,
} from "@/core/components/IconsMaterial";
import Swal from "sweetalert2";
import { OrdenService, SharedService } from "@/core/services";
import { SnackbarUtility } from "@/core/utilities";
import { useLoaderStore, useOrderStore, useSaleStore } from "@/stores";
import { PrivateRoutes } from "@/core/models";
import { useNavigate } from "react-router-dom";
import OrderWhatsApp from "./Components/OrderWhatsApp";
import OrderConvertDoc from "./Components/OrderConvertDoc";
import { orderReadForUpdateAdapter } from "@/core/adapters";
import FullScreenDialog from "@/core/components/FullScreenDialog";
import { SpliAccountProvider } from "./context";
const SplitAccount = lazy(()=>import("./SplitAccount/SplitAccount"))
export default function OrderTable() {
    const navigate = useNavigate();
    const orders = useOrderStore(state => state.orders)

    const [page, setPage] = useState(0);

    const [open, setOpen] = useState(false);
    const [openTableDialog, setOpenTableDialog] = useState(false);

    const [rowsPerPage, setRowsPerPage] = useState(5);
    const showLoader = useLoaderStore((state) => state.showLoader);
    const setDataEdit = useSaleStore((state) => state.setDataEdit);
    const [openDialodDivide, setOpenDialodDivide] = useState(false);

    const setOrderId = useRef(0);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleUpdateState = async (id: number) => {
        const { isConfirmed } = await Swal.fire({
            // title: 'Are you sure?',
            text: "Esta seguro de anular este documento!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, anular",
            cancelButtonText: "No, cancelar",
        });

        if (!isConfirmed) return;

        showLoader(true);
        OrdenService.updateState(id)
            .then((response) => {
                if (response.code === "1") {
                    SnackbarUtility.success(response.message);
                } else {
                    SnackbarUtility.error(response.message);
                }
            })
            .finally(() => showLoader(false));
    };

    const handleClickOpen = (id: number) => {
        setOrderId.current = id;
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAskToPrint = (orderId: number) => {
        SharedService.askToPrint(orderId);
    };

    const handleReport = (orderId: number) => {
        showLoader(true)
        SharedService.downloadReport(orderId).then().finally(
            () => showLoader(false)
        );
    };

    const handleEdit = (orderId: number) => {
        showLoader(true);
        OrdenService.get({
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


    const dividerCuenta = ()=>{
        setOpenDialodDivide(true)
    }
    const closeDialogDivide = ()=>{
        setOpenDialodDivide(false)
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
                                    <TableCell align="center">Fecha Emisión</TableCell>
                                    <TableCell align="center">Cliente</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                    <TableCell align="center">Estado</TableCell>
                                    <TableCell align="center">Usuario</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.slice(0, 50).map((order, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>
                                            {!(order.documentoId > 0) && (
                                                <Tooltip describeChild title="Transformar a NE O FV">
                                                    <IconButton color="info"
                                                        aria-label="delete"
                                                        onClick={() => handleClickOpen(order.orderId)}
                                                    >
                                                        <MoveUpIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            <IconButton
                                                aria-label="delete"
                                                color="error"
                                                onClick={() => handleUpdateState(order.orderId)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>

                                            {!(order.documentoId > 0) && (
                                                <Tooltip describeChild title="Editar">
                                                    <IconButton color="primary"
                                                        aria-label="Editar"
                                                        onClick={() => handleEdit(order.orderId)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}

                                            <Tooltip describeChild title="Impresión">
                                                <IconButton color="warning"
                                                    aria-label="Impresión"
                                                    onClick={() => handleAskToPrint(order.orderId)}
                                                >
                                                    <PrintIcon />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip describeChild title="Descargar PDF">
                                                <IconButton size="large" color="secondary"
                                                    aria-label="Impresión"
                                                    onClick={() => handleReport(order.orderId)}
                                                >
                                                    <SaveAltSharpIcon />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip describeChild title="Compartir por WhatsApp">
                                                <IconButton size="large" color="success"
                                                    aria-label="Impresión"
                                                    onClick={() => setOpenTableDialog(true)}
                                                >
                                                    <ShareSharpIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip describeChild title="Dividir la cuenta">
                                                <IconButton size="large" color="inherit" 
                                                    aria-label="Impresión"
                                                    onClick={() => dividerCuenta()}
                                                >
                                                    <AccountTreeIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">{order.serie}</TableCell>
                                        <TableCell align="center">{order.createdAt}</TableCell>
                                        <TableCell align="center">{order.nameFiscal}</TableCell>
                                        <TableCell align="right">{order.total}</TableCell>
                                        <TableCell align="center">-</TableCell>
                                        <TableCell align="center">{order.userName}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={orders.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>

            <OrderConvertDoc
                open={open}
                handleClose={handleClose}
            ></OrderConvertDoc>

            {/* { End list  - TABLE } */}
            <OrderWhatsApp
                open={openTableDialog}
                onClose={setOpenTableDialog}/
            > 

            {/* Dividir Cuenta  */}
            <FullScreenDialog
                color="primary"
                icon={<ArrowBackIcon />}
                isOpen={openDialodDivide}
                actions={<>Dividir Cuenta</>}
                handleClose={closeDialogDivide}>  
                 <SpliAccountProvider>
                    <SplitAccount/>
                 </SpliAccountProvider>
            </FullScreenDialog>

        </React.Fragment>
    );
}
