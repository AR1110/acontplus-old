import { Badge, Button, Grid, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { DialogCustom, EditIcon, RemoveCircleOutlineIcon, dialogOpenSubject$ } from '@/core/components';
import CategoryDialog, { dialogDataSubject$ } from './components/TableDialog';
import { ErrorBoundary } from '@/core/utils';
import { TableSvc } from '@admin/services';
import { TableReadDto } from '@admin/models';
import { useAsync, useFetchAndLoad } from '@/hooks';
import BackdropLoader from '@/core/components/BackdropLoader';
import Swal from 'sweetalert2';

export default function TablePage() {
    const [tables, setTables] = useState<Array<TableReadDto>>([]);
    const [reloadFetchApi, setReloadFetchApi] = useState(false);

    const { loading, callEndpoint } = useFetchAndLoad();

    const onOpenDialog = () => {

        dialogOpenSubject$.setSubject = true;
    };

    const getApiData = async () => await callEndpoint(TableSvc.getAll());

    const categoriesMapper = function (response: any) {
        console.log(response)
        const tablesApi: TableReadDto[] =response.tables;
        setTables(tablesApi);
    };

    useAsync(getApiData, categoriesMapper, () => {
        console.log('init')
    }, [reloadFetchApi]);

    const callBackCloseDialog = () => {
        setReloadFetchApi(!reloadFetchApi)
    }


    const dataEdit = (data: TableReadDto)=>{ 
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
            console.log(id)
        //   CategorySvc.delete(id).then(response=>{
        //     if(response.code==="0"){
        //       Snackbar.warning(response.message);
        //     }
        //     if(response.code==="1"){
        //       Snackbar.success(response.message);  
        //       callBackCloseDialog();
        //     }         
        //   }) 
        }
      }
    



    return (
        <ErrorBoundary fallBackComponent={<>Error!</>}>

            <Grid item xs={12}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={1}
                >
                    <Typography variant="h5" gutterBottom>
                        Mesas
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={onOpenDialog}
                    >
                        Agregar
                    </Button>
                </Stack>



                {loading ? <BackdropLoader open={loading} /> : <Paper
                    sx={{ p: 2, display: 'flex', flexDirection: 'column' }}
                    elevation={0}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>N°</TableCell>
                                    <TableCell >DESCRIPCIÓN</TableCell> 
                                    <TableCell align='center'>ESTADO</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tables.map((table, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>
                                        <IconButton aria-label="delete" color="primary" size="small" onClick={()=>dataEdit(table)} >
                                            <EditIcon fontSize="inherit" />
                                            </IconButton>
                                            {table.enabled && <IconButton aria-label="delete"  color="error" size="small" onClick={()=>askToUpdateState(table.id)}>
                    <RemoveCircleOutlineIcon fontSize="inherit" />
                  </IconButton>}                                           
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>{table.description}</TableCell>
                                        
                                        <TableCell align="center">
                                            <Badge badgeContent={table.enabled ? 'Activo' : 'Inactivo'} color={table.enabled ? 'success' : 'warning'}></Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                }
            </Grid>
            <DialogCustom maxWidth='xs' children={<CategoryDialog callBackCloseDialog={callBackCloseDialog} />}
            />
        </ErrorBoundary>
    );
}
