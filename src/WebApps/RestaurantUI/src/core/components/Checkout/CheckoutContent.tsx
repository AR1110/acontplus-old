import { useEffect, useState } from 'react'
import { useMobileDetect } from '@/hooks';
import { Alert, Box, Button, Grid, Modal, Skeleton } from '@mui/material'
import { CheckoutCalculator } from './CheckoutCalculator';
import { CheckoutInfo } from './CheckoutInfo';
import { PaymentMethod } from './PaymentMethod';
import FullScreenDialog from '../FullScreenDialog';
import { useCheckoutContext } from './context';

type CheckoutContentProps = {
    params: any
    closeDialog(): void
}
const CheckoutContent = ({ params, closeDialog }: CheckoutContentProps) => {
    const { isMobile } = useMobileDetect();
    const { fetchCheckout, checkoutLoading, checkoutError } = useCheckoutContext();

    const [openCheckoutInfoMobile, setOpenCheckoutInfoMobile] = useState(false);
    const [openCalculatorMobile, setOpenCalculatorMobile] = useState(false);

    useEffect(() => {
        fetchCheckout(params, closeDialog)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (checkoutLoading) {
        return (
            <>
                <Box>
                    <Skeleton />
                    <Skeleton animation="wave" />
                    <Skeleton animation={false} />
                </Box>

            </>
        )
    }
    if (checkoutError) {
        return (
            <>
                <Alert variant="filled" severity="error">
                    Error al cargar datos del cobro!
                </Alert>
            </>
        )
    }

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={5} lg={5}>
                    {
                        !(isMobile) && <CheckoutCalculator />
                    }
                </Grid>
                <Grid item xs={12} sm={12} md={7} lg={7}>
                    {
                        !(isMobile) && <CheckoutInfo />
                    }
                    <PaymentMethod/>
                </Grid>
            </Grid>

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
        </>
    )
}

export default CheckoutContent