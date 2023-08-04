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

 
import { CategoryReadDto } from '@/modules/admin/models';
import { EditIcon, RemoveCircleOutlineIcon, dialogOpenSubject$ } from '@/core/components';
import { dialogDataSubject$ } from './CategoryDialog';
import Swal from 'sweetalert2';
import { SnackbarUtilities as Snackbar } from '@/core/utils';
import { CategorySvc } from '@/modules/admin/services';

type CategoryTableProp = {
  categories: CategoryReadDto[],
  callBackCloseDialog:()=>void
}

export default function CategoryTable({categories, callBackCloseDialog}:CategoryTableProp) { 


  const dataEdit = (data: CategoryReadDto)=>{ 
    dialogOpenSubject$.setSubject = true;
    dialogDataSubject$.setSubject = data;    
  }

  const askToUpdateState = async (id: number)=>{
    const {isConfirmed} = await Swal.fire({      
      html: 'Esta seguro de eliminar esta categoria?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    })
    if(isConfirmed){
      CategorySvc.delete(id).then(response=>{
        if(response.code==="0"){
          Snackbar.warning(response.message);
        }
        if(response.code==="1"){
          Snackbar.success(response.message);  
          callBackCloseDialog();
        }         
      }) 
    }
  }


  return (
    <Paper
      sx={{ p: 2, display: 'flex', flexDirection: 'column' }}
      elevation={0}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>N°</TableCell>
              <TableCell >DESCRIPCIÓN</TableCell>
              <TableCell align="center">SIGLAS</TableCell>
              <TableCell align="center">CÓDIGO</TableCell>
              <TableCell align="center">SECUENCIAL</TableCell>
              <TableCell align="center">MONTO OBJETIVO</TableCell>
              <TableCell align='center'>ESTADO</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <IconButton aria-label="delete" color="primary" size="small" onClick={()=>dataEdit(category)} >
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                  {category.estado && <IconButton aria-label="delete"  color="error" size="small" onClick={()=>askToUpdateState(category.idSubFamilia)}>
                    <RemoveCircleOutlineIcon fontSize="inherit" />
                  </IconButton>}
                </TableCell>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell>{category.descripcion}</TableCell>
                <TableCell align="center">{category.siglas}</TableCell>
                <TableCell align="center">{category.codigo}</TableCell>
                <TableCell align="center">{category.siglas}</TableCell>
                <TableCell align="center">{category.montoObjetivo}</TableCell>
                <TableCell align="center">
                 <Badge badgeContent={category.estado?'Activo': 'Inactivo'} color={category.estado?'success':'warning'}></Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
