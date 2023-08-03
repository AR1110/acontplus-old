import { Badge, Button, Grid, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { DialogCustom, EditIcon, RemoveCircleOutlineIcon, dialogOpenSubject$ } from '@/core/components';
import CategoryDialog from './components/TableDialog';
import { ErrorBoundary } from '@/core/utils';
import { TableSvc } from '@admin/services';
import { CategoryReadDto } from '../../models';
import { useAsync, useFetchAndLoad } from '@/hooks';
import BackdropLoader from '@/core/components/BackdropLoader';

export default function TablePage() {
    const [tables, setTables] = useState<Array<CategoryReadDto>>([]);
    const [reloadFetchApi, setReloadFetchApi] = useState(false);

    const { loading, callEndpoint } = useFetchAndLoad();

    const onOpenDialog = () => {

        dialogOpenSubject$.setSubject = true;
    };

    const getApiData = async () => await callEndpoint(TableSvc.getAll());

    const categoriesMapper = function (response: any) {
        const categoriesApi: CategoryReadDto[] = JSON.parse(response.payload)
        setTables(categoriesApi);
    };

    useAsync(getApiData, categoriesMapper, () => {
        console.log('init')
    }, [reloadFetchApi]);

    const callBackCloseDialog = () => {
        setReloadFetchApi(!reloadFetchApi)
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
                                    <TableCell align="center">SIGLAS</TableCell>
                                    <TableCell align="center">CÓDIGO</TableCell>
                                    <TableCell align="center">SECUENCIAL</TableCell>
                                    <TableCell align="center">MONTO OBJETIVO</TableCell>
                                    <TableCell align='center'>ESTADO</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tables.map((category, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>
                                            {/* <IconButton aria-label="delete" color="primary" size="small" onClick={()=>dataEdit(category)} >
                    <EditIcon fontSize="inherit" />
                  </IconButton> */}

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
                                            <Badge badgeContent={category.estado ? 'Activo' : 'Inactivo'} color={category.estado ? 'success' : 'warning'}></Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                }
            </Grid>
            <DialogCustom maxWidth='sm' children={<CategoryDialog callBackCloseDialog={callBackCloseDialog} />}
            />
        </ErrorBoundary>
    );
}
