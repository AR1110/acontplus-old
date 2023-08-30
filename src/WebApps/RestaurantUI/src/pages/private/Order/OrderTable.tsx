import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { DeleteIcon, EditIcon, MoveUpIcon, PrintIcon, SaveAltSharpIcon, ShareSharpIcon } from '@/core/components';
import Swal from 'sweetalert2';
import { OrdenService, SharedService } from '@/core/services';
import { SnackbarUtility } from '@/core/utilities';
import { useLoaderStore, useSaleStore } from '@/stores';
import { OrderReadDto, PrivateRoutes } from '@/core/models';
import { useNavigate } from 'react-router-dom';

type OrderTableProps = {
    orders: Array<OrderReadDto>
}

export default function OrderTable({ orders }: OrderTableProps) {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const showLoader = useLoaderStore(state => state.showLoader);
    const setDataEdit = useSaleStore(state=>state.setDataEdit) 

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleUpdateState = async (id: number) => {
        const { isConfirmed } = await Swal.fire({
            // title: 'Are you sure?',
            text: "Esta seguro de anular este documento!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, anular',
            cancelButtonText: 'No, cancelar'
        })

        if (!isConfirmed) return

        showLoader(true)
        OrdenService.updateState(id).then(response => {
            if (response.code === "1") {
                SnackbarUtility.success(response.message)
            } else {
                SnackbarUtility.error(response.message)
            }

        }).finally(() => showLoader(false))
    }

    const handleTransformToDoc = async (id: number) => {
        console.log(id)
        const { value } = await Swal.fire({
            title: 'Seleccione el Documento',
            input: 'select',
            inputOptions: {
                "FV": 'FACTURA',
                "NE": 'NOTA DE ENTREGA'
            },
            inputPlaceholder: '...',
            showCancelButton: true,
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    if (value) {
                        resolve()
                    } else {
                        resolve('Seleccione le documento :)')
                    }
                })
            },
            confirmButtonText: `Continuar`,
            cancelButtonText: 'Cerrar',
        })
    }

    const handleAskToPrint = (orderId: number) => {
        SharedService.askToPrint(orderId)
    }

    const handleEdit = (orderId: number) => {
        showLoader(true)
        OrdenService.get({
            id: orderId,
            tipo: 2
        }).then(response => { 
            setDataEdit({
                order: response.order[0],
                orderItems: response.orderItems
            }) 
            navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.SALE}`, { replace: true })           
        }).finally(() => showLoader(false))
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%' }}>
                <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader >
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
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>

                                        {
                                            !(order.documentoId > 0) && (<Tooltip describeChild title="Transformar a NE O FV">
                                                <IconButton aria-label="delete" onClick={() => handleTransformToDoc(order.orderId)}>
                                                    <MoveUpIcon />
                                                </IconButton>
                                            </Tooltip>)
                                        }
                                        <IconButton aria-label="delete" onClick={() => handleUpdateState(order.orderId)}>
                                            <DeleteIcon />
                                        </IconButton>

                                        {
                                            !(order.documentoId > 0) && (
                                                <Tooltip describeChild title="Editar">
                                                    <IconButton aria-label="Editar" onClick={() => handleEdit(order.orderId)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )
                                        }

                                        <Tooltip describeChild title="Impresión">
                                            <IconButton aria-label="Impresión" onClick={() => handleAskToPrint(order.orderId)}>
                                                <PrintIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip describeChild title="Descargar PDF">
                                            <IconButton aria-label="Impresión" onClick={() => handleUpdateState(order.orderId)}>
                                                <SaveAltSharpIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip describeChild title="Compartir por WhatsApp">
                                            <IconButton aria-label="Impresión" onClick={() => handleUpdateState(order.orderId)}>
                                                <ShareSharpIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="center">{order.serie}</TableCell>
                                    <TableCell align="center">{order.createdAt}</TableCell>
                                    <TableCell align="center">...</TableCell>
                                    <TableCell align="right">{order.total}</TableCell>
                                    <TableCell align="center">-</TableCell>
                                    <TableCell align="center">-</TableCell>
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
    );
}
