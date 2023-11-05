import { ErrorBoundary } from '@/core/utilities'
import { useMobileDetect } from '@/hooks'
import FullScreenDialog from '../FullScreenDialog'
import { CalculateIcon, CloseIcon, KeyboardArrowDownIcon } from '../IconsMaterial'
import CheckoutContent from './CheckoutContent'
import { CheckoutProvider } from './context'


type CheckoutProps = {
    params: {
        codEstab: string
        idCuentaPorCobrar: number
        tiempoCredito: number
    }
    open: boolean,
    closeDialog(): void
}

const Checkout = ({ params, open, closeDialog }: CheckoutProps) => {
    const { isMobile } = useMobileDetect();

    return (
        <ErrorBoundary fallBackComponent={<>Error en el cobro!</>}>
            <CheckoutProvider>
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
                                        {/* <IconButton aria-label="Calculator mobile" onClick={() => setOpenCalculatorMobile(true)}>
                                            <CalculateIcon />
                                        </IconButton>
                                        <Stack direction="row" spacing={1} alignItems="center" onClick={() => {
                                            setOpenCheckoutInfoMobile(true)
                                        }}> */}
                                        {/* <Typography variant="body1" display="block" gutterBottom>
                                            ${voucher.payingAmount}
                                        </Typography> */}
                                        <KeyboardArrowDownIcon />

                                        {/* </Stack> */}
                                    </>
                                )
                            }

                        </>
                    }
                > 
                    <CheckoutContent closeDialog={closeDialog} params={params} />
                </FullScreenDialog>
            </CheckoutProvider>
        </ErrorBoundary>
    )
}

export default Checkout