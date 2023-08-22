import { PaymentsIcon, SaveIcon, TaskIcon } from '@/core/components'
import Calculator from '@/core/components/Calculator/Calculator';
import HtmlTooltip from '@/core/components/HtmlTooltip';
import { useCheckoutStore, useSaleStore } from '@/stores'
import { Box, Button, Card, CardActions, CardContent, Divider, FormControl, Grid, InputLabel, OutlinedInput, Typography } from '@mui/material'
import { useState } from 'react';


export default function Checkout() {
    const { voucher } = useCheckoutStore(state => state.checkout);
    const setReceivedAmount = useCheckoutStore(state=>state.setReceivedAmount)
    const [isReplaceReceivedAmount, setIsReplaceReceivedAmount] = useState(true)

    const onChangeReceivedAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value.replace(/[^0-9.]/g, '');
        const numeroStr = voucher.receivedAmount.toString();
         if(!inputValue){
            setReceivedAmount('0')  
            return  
         }
         console.log(numeroStr)
         if(numeroStr==="0"){
            setReceivedAmount('') 
         }
         setReceivedAmount(inputValue)    
    }; 
    
    const checkoutClearButton = ()=>{
        const numeroStr = voucher.receivedAmount.toString();
        let receivedAmount = "0"; 
        console.log(voucher.receivedAmount)
        if(voucher.receivedAmount==="0"){
            setReceivedAmount(receivedAmount)
            return
        }
        if(voucher.receivedAmount!=="0"){            
            const nuevoNumeroStr = numeroStr.substring(0, numeroStr.length - 1); // Elimina los últimos "cantidad" dígitos
            receivedAmount = nuevoNumeroStr? nuevoNumeroStr : '0';
        }
        setReceivedAmount(receivedAmount)
    }
 
    const handleChangeSetReceivedAmount = (value: number | string)=>{         
        const numeroStr = voucher.receivedAmount.toString();
        if(value===0) {
            setReceivedAmount("0")
            return
        }

        console.log(isReplaceReceivedAmount)
        if(isReplaceReceivedAmount){
            if(value==='.') return
            setReceivedAmount(value.toString())
            setIsReplaceReceivedAmount(false);
            return
        }

        // if(numeroStr==="0"){
        //     setReceivedAmount(value.toString())
        //     return
        // }
        console.log(0)

        setReceivedAmount(numeroStr + value.toString())    
    }
 
    return (
        <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={12} sm={5} md={5}>
                <Calculator clearButton={checkoutClearButton} onClickButton={handleChangeSetReceivedAmount} />
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
                                                $4.50
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
