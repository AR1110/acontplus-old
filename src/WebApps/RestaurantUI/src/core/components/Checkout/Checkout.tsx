import { useEffect, useState } from 'react'
import { ErrorBoundary } from '@/core/utilities'
import { Box, Button, Grid, IconButton, Modal, Stack, Typography } from '@mui/material' 
import { useMobileDetect } from '@/hooks' 
import { useCheckoutStore, useLoaderStore } from '@/stores'
import { AccountReceivableService } from '@/core/services' 
import { CheckoutCalculator } from './CheckoutCalculator'
import { CheckoutInfo } from './CheckoutInfo'
import { PaymentMethod } from './PaymentMethod'
import FullScreenDialog from '../FullScreenDialog'
import { CalculateIcon, CloseIcon, KeyboardArrowDownIcon } from '../IconsMaterial'
 

type CheckoutProps = {
    open: boolean,
    closeDialog(): void
}

const Checkout = ({ open, closeDialog }: CheckoutProps) => {
    const { isMobile } = useMobileDetect();
    const { showLoader } = useLoaderStore();
    const [openCheckoutInfoMobile, setOpenCheckoutInfoMobile] = useState(false);
    const [openCalculatorMobile, setOpenCalculatorMobile] = useState(false);

    const queryParams = useCheckoutStore(state => state.queryParams)
    const setCheckoutDataForm = useCheckoutStore(state => state.setCheckoutDataForm);
    const voucher = useCheckoutStore(state => state.checkout.voucher);

   
    const initiload = async () => {
        showLoader(true);
        await AccountReceivableService.get({
            tipo: 3,
            codEstab: queryParams.codEstab,
            idCuentaPorCobrar: queryParams.idCuentaPorCobrar,
            credito: queryParams.tiempoCredito
        }).then(response => {
            console.log(response)
            setCheckoutDataForm(response);
        }).finally(() => showLoader(false))
    }

    useEffect(() => {
        initiload();
    }, [])


    return (
        <ErrorBoundary fallBackComponent={<>Error en el cobro!</>}>
            <FullScreenDialog
                color="inherit"
                icon={<CloseIcon />}
                dialogTitle="Cobro"
                isOpen={open}
                handleClose={closeDialog}
                actions={
                    <>
                        {
                            isMobile && (
                                <>
                                    <IconButton aria-label="Calculator mobile" onClick={() => setOpenCalculatorMobile(true)}>
                                        <CalculateIcon />
                                    </IconButton>
                                    <Stack direction="row" spacing={1} alignItems="center" onClick={() => {
                                        setOpenCheckoutInfoMobile(true)
                                    }}>
                                        <Typography variant="body1" display="block" gutterBottom>
                                            ${voucher.payingAmount}
                                        </Typography>
                                        <KeyboardArrowDownIcon />

                                    </Stack>
                                </>
                            )
                        }

                    </>
                }

            >
                <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid item xs={12} sm={5} md={5}>
                        {
                            !(isMobile) && <CheckoutCalculator />
                        }
                    </Grid>
                    <Grid item xs={12} sm={7} md={7}>
                        {
                            !(isMobile) && <CheckoutInfo />
                        }
                        <PaymentMethod closeDialog={closeDialog} />
                    </Grid>
                </Grid>
            </FullScreenDialog>

            {/* Info mobile */}
            <FullScreenDialog color="inherit"
                isOpen={openCheckoutInfoMobile}
                actions={
                    <Button variant="contained" onClick={() => setOpenCheckoutInfoMobile(false)}>Cerrar</Button>
                }
                handleClose={() => {
                    setOpenCheckoutInfoMobile(false)
                }}>
                <CheckoutInfo />
            </FullScreenDialog>


            {/* Mobile  calculadora */}
            <Modal
                open={openCalculatorMobile}
                onClose={() => setOpenCalculatorMobile(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"

            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <CheckoutCalculator />
                    <Button
                        size='large'
                        variant="contained"

                        fullWidth // Make the button full width
                        onClick={() => setOpenCalculatorMobile(false)}
                    >
                        Cerrar
                    </Button>
                </Box>
            </Modal>

        </ErrorBoundary>
    )
}

export default Checkout