

import React, { forwardRef, useEffect, useState } from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Slide,
    styled
} from '@mui/material';
import {
    DataGrid,
    GridColDef,
} from '@mui/x-data-grid';
import { TransitionProps } from '@mui/material/transitions';
import { PrintIcon, SaveAltSharpIcon, SendToMobileIcon, ShareSharpIcon } from '@/core/components/IconsMaterial';
import { orderService } from '@/core/services';

const columns: GridColDef[] = [
    {
        field: 'actions',
        type: 'actions',
        width: 220,
        renderCell: (cellValues) => {
            return (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        size='large' 
                        sx={{ ml: 1 }}
                    >
                        <PrintIcon />
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        size='large'
                        sx={{ ml: 1 }} 
                    >
                        <SaveAltSharpIcon />
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        size='large'
                        sx={{ ml: 1, mr:1 }} 
                    >
                        {/* <SendToMobileIcon /> */}
                        <ShareSharpIcon/>
                    </Button>
                </>
            );
        }
        // getActions: (params) => [
        //     <GridActionsCellItem
        //         size='large'
        //         icon={<PrintIcon />}
        //         label="Imprimir"

        //     />,
        //     <GridActionsCellItem
        //         icon={<PictureAsPdfIcon />}
        //         label="Toggle Admin" 
        //     />, 
        // ],
    },
    {
        field: 'docType',
        headerName: 'N°',
        width: 50
    },
    {
        field: 'serie',
        headerName: 'Nro. Doc',
        width: 160
    },
    {
        field: 'createAt',
        headerName: 'F. Emisión',
        width: 150,
    },
    {
        field: 'customerName',
        headerName: 'Cliente',
        width: 180,
    },
    {
        field: 'total',
        headerName: 'Total',
        type: 'number',
        width: 80,
    },
    
];

const StyledBox = styled(Box)(({ theme }) => ({
    height: 350,
    width: '100%',
    '& .MuiDataGrid-cell--editing': {
        backgroundColor: 'rgb(255,215,115, 0.19)',
        color: '#1a3e72',
        '& .MuiInputBase-root': {
            height: '100%',
        },
    },
    '& .Mui-error': {
        backgroundColor: `rgb(126,10,15, ${theme.palette.mode === 'dark' ? 0 : 0.1})`,
        color: theme.palette.error.main,
    },
}));



const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} {...props} />;
});


type IOrderDocument = {
    id: number
    documentId: number
    docType: string
    serie: string
    createAt: string
    customerName: string
    userName: string
    total: number
    abono: number
    saldo: number
}

type OrderDocumentProps = {
    id: number
    open: boolean,
    setOpen(): void
}


const OrderDocument = ({ id, open, setOpen }: OrderDocumentProps) => {
    const [loader, setLoader] = useState(false);
    const [orderDocuments, setOrderDocuments] = useState<Array<IOrderDocument>>([])
    let controller: AbortController;

    const closeModal = () => {
        setOpen();
    }

    const getOrderDocuments = async () => {
        try {
            setLoader(true)
            const dataFetch = orderService.getId(id, 3);

            if (dataFetch.controller) controller = dataFetch.controller;

            const resultAxios = await dataFetch.call;

            const response = resultAxios.data;
            setOrderDocuments(response.orderDocuments.map((orderDoc: IOrderDocument, index: number) => ({
                ...orderDoc,
                id: index
            })))
            setLoader(false)
        } catch (error) {
            console.log(error)
            setLoader(false)
        }
    }

    // Función para cancelar la solicitud de datos de pedido
    const cancelEndpoint = () => {
        controller && controller.abort();
    };

    useEffect(() => {
        getOrderDocuments();
        return () => {
            // Cancela la solicitud de datos de pedido al desmontar
            cancelEndpoint();
        };
    }, [])

    return (
        <Dialog
            fullWidth={true}
            maxWidth="md"
            TransitionComponent={Transition}
            keepMounted
            open={open}
        >
            <DialogTitle>
                {"Order Documento"}
            </DialogTitle>
            {/* <Typography variant="h6" sx={{
                position: 'absolute',
                right: 8,
                top: 15,
                mr: 3
            }}>
                <b>Total:</b> {objTempTotal.total}
            </Typography> */}
            <DialogContent dividers>
                <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }} paddingBottom={2}>
                    <Grid item xs={2} sm={4} md={6}>
                        <Button variant="contained" color='primary' fullWidth startIcon={<PrintIcon />} sx={{
                            height: 60
                        }}>
                            Imprimir pedido
                        </Button>
                    </Grid>
                    <Grid item xs={2} sm={4} md={6}>
                        <Button variant="contained" color='secondary' fullWidth startIcon={<SaveAltSharpIcon />} sx={{
                            height: 60
                        }}>
                            Pedido PDF
                        </Button>
                    </Grid>
                </Grid>
                <StyledBox>
                    <DataGrid
                        sx={{
                            boxShadow: 2,
                            border: 2,
                            borderColor: 'primary.light',
                            '& .MuiDataGrid-cell:hover': {
                                color: 'primary.main',
                            },
                        }}
                        //autoHeight
                        loading={loader}
                        rows={orderDocuments}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                    />
                </StyledBox>
            </DialogContent>
            <DialogActions>
                <Button color='inherit' variant='outlined' sx={{
                    height: 60
                }} size='large' fullWidth onClick={closeModal}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default OrderDocument
