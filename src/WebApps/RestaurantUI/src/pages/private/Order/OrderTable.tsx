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
import { DeleteIcon, MoveUpIcon } from '@/core/components';
import Swal from 'sweetalert2';
import { OrdenService } from '@/core/services';
import { SnackbarUtility } from '@/core/utilities';
import { useLoaderStore } from '@/stores';


const rows = [
    { id: 1, nroDoc: 'Frozen yoghurt', customerName: 'Gorge Manda', createDate: '08/28/2023', total: 6.0, estado: "  Pendiente", userName: "Emilio" },
    { id: 2, nroDoc: 'Frozen yoghurt', customerName: 'Gorge Manda', createDate: '08/28/2023', total: 6.0, estado: "  Pendiente", userName: "Emilio" },
    { id: 3, nroDoc: 'Frozen yoghurt', customerName: 'Gorge Manda', createDate: '08/28/2023', total: 6.0, estado: "  Pendiente", userName: "Emilio" },
];

export default function OrderTable() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const showLoader = useLoaderStore(state => state.showLoader)

    const handleChangePage = (event: unknown, newPage: number) => {
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
                if (!value) return 'Seleccione el documento';
            },
            confirmButtonText: `Continuar`,
            cancelButtonText: 'Cerrar',
        })

        console.log(value)


    }
    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%' }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                            {rows.map((row, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>

                                        <Tooltip describeChild title="Transformar a NE O FV">
                                            <IconButton aria-label="delete" onClick={() => handleTransformToDoc(row.id)}>
                                                <MoveUpIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <IconButton aria-label="delete" onClick={() => handleUpdateState(row.id)}>
                                            <DeleteIcon />
                                        </IconButton>

                                    </TableCell>
                                    <TableCell align="center">{row.nroDoc}</TableCell>
                                    <TableCell align="center">{row.createDate}</TableCell>
                                    <TableCell align="center">{row.customerName}</TableCell>
                                    <TableCell align="right">{row.total}</TableCell>
                                    <TableCell align="center">{row.estado}</TableCell>
                                    <TableCell align="center">{row.userName}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}
