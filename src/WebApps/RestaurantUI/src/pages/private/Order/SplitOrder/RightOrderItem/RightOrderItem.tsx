import { itemToApi, summaryToApi } from '@/core/adapters';
import CustomerSearch from '@/core/components/Customer/CustomerSearch';
import { ArrowForwardIosIcon, FileCopyRoundedIcon } from '@/core/components/IconsMaterial';
import { DOC_TYPE } from '@/core/constants';
import { orderService } from '@/core/services';
import { SnackbarUtility } from '@/core/utilities';
import { hideLoader, showLoader } from "@/spinner";
import { Accordion, AccordionDetails, AccordionProps, AccordionSummary, AccordionSummaryProps, Button, Card, CardActions, CardContent, Grid, styled, TextField, Typography } from '@mui/material'
import Swal from 'sweetalert2';

import { useSplitOrderContext } from '../../context';
import RightOrderItemTable from './RightOrderItemTable'

const StyledAccordion = styled((props: AccordionProps) => (
    <Accordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:before': {
        display: 'none',
    },
}));

const StyledAccordionSummary = styled((props: AccordionSummaryProps) => (
    <AccordionSummary
        expandIcon={<ArrowForwardIosIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const RightOrderItem = () => {
    const { leftOrder, rightOrder, setRightOrderData, rightOrderItems } = useSplitOrderContext();
    const { setPaymentData, resetData } = useSplitOrderContext();


    const typeActions: { [key: string]: string } = {
        [DOC_TYPE.FV]: `
        Esta seguro de guardar la cuenta individual como Factura? </br>
        <small>Ya no será posible modificar la venta para hacer cambios, tendrás que cancelar esta y crear una nueva.!</small>`,
        [DOC_TYPE.NE]: `
        Esta seguro de guardar cuenta individual como Nota de Entrega? </br>
        <small>Ya no será posible modificar la venta para hacer cambios, tendrás que cancelar esta y crear una nueva.!</small>`,
    }

    const save = async (codDoc: string) => {
        try {

            if (!(rightOrder.customerCompanyId > 0)) {
                SnackbarUtility.warning('Seleccione el cliente');
                return
            }

            if (rightOrderItems.length === 0) {
                SnackbarUtility.warning('Seleccione al menos un item para la cuenta individual');
                return
            }

            const { isConfirmed } = await Swal.fire({
                title: `Guardar Cuenta Invidual`,
                html: typeActions[codDoc],
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Guardar',
                cancelButtonText: 'No, cancelar!'
            })

            if (!isConfirmed) return

            const mergeLeftIntoRightOrder = {
                ...rightOrder,
                establecimientoId: leftOrder.establecimientoId,
                puntoEmisionId: leftOrder.puntoEmisionId,
                tableId: leftOrder.tableId,
                bodegaId: leftOrder.bodegaId
            }
 

            const orderResult = summaryToApi(mergeLeftIntoRightOrder);
            const orderItemsResult = itemToApi(rightOrderItems);
            //Corregir la cantidad 
            const orderItems = orderItemsResult.map(item => ({
                ...item,
                quantity: item.remainingQuantity
            }))

            const data = {
                ...orderResult,
                // subtotalSinImpuestos: objTempTotal.subTotalSinImpuestos,
                // tax: objTempTotal.tax,
                updateOrder: false,
                saveDoc: (codDoc === DOC_TYPE.FV) || (codDoc === DOC_TYPE.NE),
                codDoc,
                quickSale: (codDoc === DOC_TYPE.FV) || (codDoc === DOC_TYPE.NE),
                items: orderItems,
                itemsToPay: orderItems,
            }

            console.log(data)
        
            showLoader();
            orderService.put(leftOrder.orderId, data).then(response => {
                hideLoader();
                if (response.code === '0') {
                    SnackbarUtility.warning(response.message)
                }
                if (response.code === "1") {
                    SnackbarUtility.success(response.message);
   
                    
                    const queryParams = JSON.parse(response.payload)[0];
                    
                    setPaymentData({
                        open: true,
                        payload: queryParams
                    })
                    resetData();
                }
            })
                .catch(() => hideLoader())


        } catch (error: any) {
            SnackbarUtility.error(error)
        }
    }
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                                <Grid item xs>
                                    <Typography variant="h6" component="div">
                                        Cuenta Individual
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Typography variant="h6">
                                    Total: ${rightOrder.total}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <StyledAccordion sx={{ mb: 1 }}>
                        <StyledAccordionSummary aria-controls="panel-information" id="panel-information">
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                Datos
                            </Typography>
                        </StyledAccordionSummary>
                        <StyledAccordionDetails>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <CustomerSearch customerCompanyId={rightOrder.customerCompanyId} customerName={rightOrder.customerName} onChangeCustomer={(data) => {
                                        if (data) {
                                            setRightOrderData({
                                                ...rightOrder,
                                                customerCompanyId: data.customerCompanyId,
                                                customerName: data.customerName
                                            })
                                        }
                                    }} />

                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="obs"
                                        label="Observación"
                                        name='obs'
                                        onChange={(e) => {
                                            setRightOrderData({
                                                ...rightOrder,
                                                obs: e.target.value
                                            })
                                        }}
                                        fullWidth
                                        multiline
                                    />
                                </Grid>
                            </Grid>
                        </StyledAccordionDetails>
                    </StyledAccordion>
                    <RightOrderItemTable />
                </CardContent>
                <CardActions>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                color='success'
                                size='large'
                                sx={{
                                    height: 60
                                }}
                                onClick={() => save(DOC_TYPE.FV)}
                                startIcon={<FileCopyRoundedIcon />}
                            >
                                Factura
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                color='warning'
                                size='large'
                                sx={{
                                    height: 60
                                }}
                                onClick={() => save(DOC_TYPE.NE)}
                                startIcon={<FileCopyRoundedIcon />}
                            >
                                Nota Entrega
                            </Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </>
    )
}

export default RightOrderItem