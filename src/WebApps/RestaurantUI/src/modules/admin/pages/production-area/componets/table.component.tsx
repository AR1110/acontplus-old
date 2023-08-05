import {
  EditIcon,
  RemoveCircleOutlineIcon,
  dialogOpenSubject$,
} from '@/core/components';
import { ProductionAreaReadDto } from '@/modules/admin/models/production-area.model';
import {
  Badge,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { dialogDataSubject$ } from '../../table/components/TableDialog';
import Swal from 'sweetalert2';
import { ProductionAreaSvc } from '@/modules/admin/services/production-area.service';
import { SnackbarUtilities as Snackbar } from '@/core/utils';

type Props = {
  productionArea: ProductionAreaReadDto[];
  callBackCloseDialog: () => void;
};

export default function TableComponent({
  productionArea,
  callBackCloseDialog,
}: Props) {
  const dataEdit = (data: ProductionAreaReadDto) => {
    dialogOpenSubject$.setSubject = true;
    dialogDataSubject$.setSubject = data;
  };

  const askToUpdateState = async (id: number) => {
    const { isConfirmed } = await Swal.fire({
      html: 'Esta seguro de eliminar esta Área de Producción?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    });
    if (isConfirmed) {
      ProductionAreaSvc.delete(id).then((response) => {
        if (response.code === '0') {
          Snackbar.warning(response.message);
        }
        if (response.code === '1') {
          Snackbar.success(response.message);
          callBackCloseDialog();
        }
      });
    }
  };

  return (
    <Paper
      sx={{ p: 2, display: 'flex', flexDirection: 'column' }}
      elevation={0}
    >
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>N°</TableCell>
              <TableCell>DESCRIPCIÓN</TableCell>
              <TableCell align="center">CÓDIGO</TableCell>
              <TableCell align="center">FECHA REGISTRO</TableCell>
              <TableCell align="center">FECHA ACTUALIZACIÓN</TableCell>
              <TableCell align="center">ESTADO</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productionArea.map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <IconButton
                    aria-label="delete"
                    color="primary"
                    size="small"
                    onClick={() => dataEdit(row)}
                  >
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                  {row.enabled && (
                    <IconButton
                      aria-label="delete"
                      color="error"
                      size="small"
                      onClick={() => askToUpdateState(row.id)}
                    >
                      <RemoveCircleOutlineIcon fontSize="inherit" />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell align="center">{row.code}</TableCell>
                <TableCell align="center">{row.createdAt}</TableCell>
                <TableCell align="center">{row.updatedAt}</TableCell>
                <TableCell align="center">
                  <Badge
                    badgeContent={row.enabled ? 'Activo' : 'Inactivo'}
                    color={row.enabled ? 'success' : 'warning'}
                  ></Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
