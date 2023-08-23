import { PaymentsIcon, SaveIcon, TaskIcon } from '@/core/components'
import Calculator from '@/core/components/Calculator/Calculator';
import HtmlTooltip from '@/core/components/HtmlTooltip';
import { useCheckoutStore, useSaleStore } from '@/stores'
import { Box, Button, Card, CardActions, CardContent, Divider, FormControl, Grid, InputLabel, OutlinedInput, Typography } from '@mui/material'
import { useState } from 'react';


export default function Checkout() {
    const { voucher } = useCheckoutStore(state => state.checkout);
    const { setReceivedAmount, setChangeReturn } = useCheckoutStore(state => ({
        setReceivedAmount: state.setReceivedAmount,
        setChangeReturn: state.setChangeReturn
    }))

    const [isReplaceReceivedAmount, setIsReplaceReceivedAmount] = useState(true)
    const [isOptionReceivedAmount, setIsOptionReceivedAmount] = useState(false)

    const onChangeReceivedAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value.replace(/[^0-9.]/g, '');
        const numeroStr = voucher.receivedAmount.toString();
        if (!inputValue) {
            setReceivedAmount('0')
            return
        } 
        if (numeroStr === "0") {
            setReceivedAmount('')
        }
        setReceivedAmount(inputValue)
        setChangeReturn()
    };

    const handleClickOptionReceivedAmount = (inputValue: number) => {
        setReceivedAmount(inputValue.toString());
        setIsOptionReceivedAmount(true)
        setChangeReturn()
    }

    const handleChangeSetReceivedAmount = (value: number | string) => {
        const numeroStr = voucher.receivedAmount.toString();
        const valueCalculator = value.toString();
        if (numeroStr === "0" && (valueCalculator === "0")) return


        if (value === "." && numeroStr.split(".").length > 1) return

        if (numeroStr === "0" && valueCalculator === '.') {
            setReceivedAmount(numeroStr + valueCalculator);
            setChangeReturn()
            return
        }
        if (numeroStr === "0" || isOptionReceivedAmount) {
            setReceivedAmount(valueCalculator);            
            setIsOptionReceivedAmount(false);
            setChangeReturn()
            return
        }
        if (isReplaceReceivedAmount) {
            setReceivedAmount(valueCalculator)
            setIsReplaceReceivedAmount(false);
            setChangeReturn()
            return
        }

        setReceivedAmount(numeroStr + valueCalculator)
        setChangeReturn()
    }

    const checkoutClearButton = () => {
        const numeroStr = voucher.receivedAmount.toString();
        let receivedAmount = "0";
        console.log(voucher.receivedAmount)
        if (voucher.receivedAmount === "0") {
            setReceivedAmount(receivedAmount);
            setChangeReturn()
            return
        }
        if (voucher.receivedAmount !== "0") {
            const nuevoNumeroStr = numeroStr.substring(0, numeroStr.length - 1); // Elimina los últimos "cantidad" dígitos
            receivedAmount = nuevoNumeroStr ? nuevoNumeroStr : '0';
        }
        setReceivedAmount(receivedAmount)
        setChangeReturn()
    }

    return (
        <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={12} sm={5} md={5}>
                <Calculator
                    clearButton={checkoutClearButton}
                    onClickButton={handleChangeSetReceivedAmount}
                    onClickOptionValue={handleClickOptionReceivedAmount}
                />
            </Grid>
            <Grid item xs={12} sm={7} md={7}>
                <Box sx={{ flexGrow: 1 }}>

                    <Card variant="outlined">
                        <CardContent>
                            <Grid item xs={12} sm container>
                                <Grid item xs container direction="column" spacing={2}>
                                    <Grid item xs>
                                        <Typography variant="h5" component="div">
                                            Total
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Typography variant="h5" component="div">
                                        ${voucher.payingAmount}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Divider sx={{ my: 5 }} />
                            <Grid item xs={12} sm container>
                                <Grid item xs>
                                    <FormControl fullWidth margin='normal'>
                                        <InputLabel htmlFor="cashValue">Efectivo</InputLabel>
                                        <OutlinedInput inputRef={(input) => input?.focus()}
                                            id="cashValue"
                                            value={voucher.receivedAmount}
                                            onChange={onChangeReceivedAmount}

                                            startAdornment={<PaymentsIcon />}
                                            label="Cash Value"
                                            inputProps={{
                                                style: {
                                                    textAlign: 'right',
                                                    fontSize: 30,
                                                },
                                            }}
                                        />

                                    </FormControl>
                                </Grid>
                            </Grid>

                            {
                                voucher.changeReturn > 0 && (
                                    <Grid container alignItems="center">
                                        <Grid item xs>
                                            <Typography gutterBottom variant="h5" component="div">
                                                Cambio
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography gutterBottom variant="h5" component="div" color="error">
                                                ${voucher.changeReturn}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                )
                            }
                        </CardContent>
                        <CardActions>
                            <Grid container spacing={2} columns={16}>
                                <Grid item xs={16} md={8} lg={8}>

                                </Grid>
                                <Grid item xs={16} md={8} lg={8}>
                                    {/* <HtmlTooltip
                                        title={
                                            <>
                                                <Typography variant="caption" display="block" gutterBottom>
                                                    {"Ya no será posible modificar la venta - para hacer cambios, tendrás que cancelar esta y crear una nueva."}
                                                </Typography>
                                            </>
                                        }
                                    >
                                    </HtmlTooltip> */}
                                    <Button variant='contained' color="success" startIcon={<SaveIcon fontSize="large" style={{
                                        fontSize: 40
                                    }} />} size='large' fullWidth sx={{
                                        height: 80
                                    }}>
                                        Guardar
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardActions>
                    </Card>
                </Box>

            </Grid>
        </Grid>
    )
}
