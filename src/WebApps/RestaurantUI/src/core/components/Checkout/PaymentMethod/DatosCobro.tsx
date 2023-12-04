
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useCheckoutContext } from '../context';
import { formatDateShort } from '@/core/utilities';
import { DeleteIcon } from '../../IconsMaterial';
import { IconButton } from '@mui/material';


export default function DatosCobro() {
    const { checkout, removePaymentType } = useCheckoutContext();
    const { multiplesPaymentType } = checkout;
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell align='center'>N°</TableCell>
                        <TableCell align="center">F. Emisión</TableCell>
                        <TableCell align="center">SubEntidad</TableCell>
                        <TableCell align="right">Valor</TableCell>
                        <TableCell align="right">Abono</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {multiplesPaymentType.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <IconButton aria-label="delete" color="error" onClick={() => removePaymentType(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                            <TableCell align="center">{index + 1}</TableCell>
                            <TableCell align="center">{formatDateShort(row.creationDate)}</TableCell>
                            <TableCell align="center">{row.paymentSubTypeName}</TableCell>
                            <TableCell align="right">${row.receivedAmount}</TableCell>
                            <TableCell align="right">${row.payingAmount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
