import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData(' ', 159, 6.0, 24, 4.0),
    createData(' ', 237, 9.0, 37, 4.3),
    createData('', 262, 16.0, 24, 6.0),
    createData('', 305, 3.7, 67, 4.3),
    createData('', 356, 16.0, 49, 3.9),
];

export default function DatosCobro() {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>N°</TableCell>
                        <TableCell align="center">F. Emisión</TableCell>
                        <TableCell align="right">SubEntidad</TableCell>
                        <TableCell align="right">Valor</TableCell>
                        <TableCell align="right">Nro.</TableCell>
                        <TableCell align="right">Abono</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            
                        >
                            <TableCell>
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.calories}</TableCell>
                            <TableCell align="right">{row.fat}</TableCell>
                            <TableCell align="right">{row.carbs}</TableCell>
                            <TableCell align="right">{row.protein}</TableCell>
                            <TableCell align="right">{row.protein}</TableCell>
                            <TableCell align="right">{row.protein}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
