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
import { Button, Stack, Tooltip } from "@mui/material";

import {
    AccountTreeIcon,
    ArrowBackIcon,
    AspectRatioIcon,
    ClearIcon,
    EditIcon,
} from "@/core/components/IconsMaterial";
import { orderService } from "@/core/services";
import { useSaleStore } from "@/stores";
import { PrivateRoutes } from "@/core/models";
import { orderReadForUpdateAdapter } from "@/core/adapters";
import FullScreenDialog from "@/core/components/FullScreenDialog";
import { SplitOrderProvider, useOrderContext } from "./context";
import OrderDocument from "./OrderDocument/OrderDocument";
import { showLoader, hideLoader } from "@/spinner";
import Swal from "sweetalert2";
import { SnackbarUtility } from "@/core/utilities";
const SplitOrder = lazy(() => import("./SplitOrder/SplitOrder"));

export default function OrderTable() {
    const navigate = useNavigate();
    const { fetchOrders, orders, setDataFilter } = useOrderContext();

    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(25);
    const setDataEdit = useSaleStore((state) => state.setDataEdit);
    const [openDialodDivide, setOpenDialodDivide] = useState(false);

    const [openDocument, setOpenDocument] = useState(false)

    const setOrderId = useRef(0)
    const dataOrder = useRef({} as typeof orders[0]);

    const handleChangePage = (_: unknown, newPage: number) => {
        setDataFilter("pageIndex", newPage + 1)
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        const pageSize = parseInt(event.target.value, 10)
        setDataFilter("pageSize", pageSize)
        setRowsPerPage(pageSize);
        setPage(0)
    };


    const handleEdit = (orderId: number) => {
        showLoader();
        orderService.get({
            id: orderId,
            tipo: 2,
        }).then(async (response) => {
            const data = await orderReadForUpdateAdapter(response);
            setDataEdit(data);
            navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.SALE}`, {
                replace: true,
            });
        }).finally(() => hideLoader());
    };


    const dividerCuenta = (id: number) => {
        setOrderId.current = id;
        setOpenDialodDivide(true)
    }

    function closeDialogDivide<T>(value: T) {
        if (typeof value === 'string' && value === 'CUSTOM_DETAIL') {
            fetchOrders()
        }
        setOpenDialodDivide(false)
    }

    function closeOrderDocument() {
        setOpenDocument(false)
    }

    const askToDelete = (id: number) => {
        try {
            Swal.fire({
                //title: "Are you sure?",
                html: "Esta seguro de anular el pedido?",
                icon: "warning",
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, anular!",
                cancelButtonText: 'No, cancelar!'
            }).then(result => {
                if (result.isConfirmed) {
                    showLoader();
                    orderService.delete(id).then(response => {
                        if (response) {
                            if (response.code === "0") {
                                SnackbarUtility.info(response.message)
                            }
                            if (response.code === "1") {
                                SnackbarUtility.info(response.message);
                                fetchOrders()
                            }
                        }
                    })
                        .catch(error => {
                            console.log(error)
                        })
                        .finally(() => hideLoader())
                }
            })
        } catch (error) {
            console.log(error)
        }
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
                                    <TableCell align="center">Mesa</TableCell>
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
                                            <Stack direction="row" spacing={1}>
                                                {
                                                    (order.finished || order.divided) ? '': (
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

                                                <Tooltip describeChild title="PDF e Impresión">
                                                    <Button variant="contained" color="primary"
                                                        aria-label="PDF e Impresión"
                                                        onClick={() => {
                                                            dataOrder.current = order;
                                                            setOpenDocument(true)
                                                        }}
                                                    >
                                                        <AspectRatioIcon />
                                                    </Button>
                                                </Tooltip>

                                                {
                                                    ((!(order.divided)) && !(order.finished)) && (
                                                        <Tooltip describeChild title="Dividir la cuenta">
                                                            <Button variant="contained" size="large" color="inherit"
                                                                aria-label="Dividir"
                                                                onClick={() => dividerCuenta(order.orderId)}
                                                            >
                                                                <AccountTreeIcon />
                                                            </Button>
                                                        </Tooltip>
                                                    )
                                                }
                                                {
                                                    (order.finished || order.divided) ? '' : (
                                                        <Tooltip describeChild title="Anular">
                                                            <Button variant="contained" color="error"
                                                                aria-label="Anular"
                                                                onClick={() => askToDelete(order.orderId)}
                                                            >
                                                                <ClearIcon />
                                                            </Button>
                                                        </Tooltip>
                                                    ) 
                                                }
                                               
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="center"> {order.serie}</TableCell>
                                        <TableCell align="center">{order.createdAt}</TableCell>
                                        <TableCell align="center">{order.nameFiscal}</TableCell>
                                        <TableCell align="right">{order.total}</TableCell>
                                        <TableCell align="center">{order.tableName}</TableCell>
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
                openDocument && <OrderDocument data={dataOrder.current} open={openDocument} setOpen={closeOrderDocument} />
            }



        </React.Fragment>
    );
}
