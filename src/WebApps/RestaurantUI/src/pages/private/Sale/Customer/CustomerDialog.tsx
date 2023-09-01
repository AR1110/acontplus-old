import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, TextField } from '@mui/material'
import React, { FormEvent } from 'react'

type CustomDialogProp = {
    open: boolean
    handleClose(open: boolean): void
}

const CustomerDialog = ({ open, handleClose }: CustomDialogProp) => {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('dkjghke')
    };
    return (
        <Dialog   open={open} onClose={()=>handleClose(true)} fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Nuevo Cliente</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>

                        <Grid item xs={2} sm={6} md={6}>
                            <TextField fullWidth
                                id="outlined-select-currency"
                                select
                                label="Tipo Identificación"
                                helperText="Please select your currency"
                            >

                                <MenuItem >
                                    dfdf
                                </MenuItem>

                            </TextField>
                        </Grid>
                        <Grid item xs={2} sm={6} md={6}>
                            <TextField
                                fullWidth
                                required
                                autoFocus
                                id="outlined-required"
                                label="Nro. Identificación"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <TextField
                                fullWidth
                                required
                                id="outlined-required"
                                label="Nombre Fiscal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <TextField
                                fullWidth
                                required
                                id="outlined-required"
                                label="Nombre Comercial"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <TextField fullWidth
                                id="outlined-multiline-static"
                                label="Multiline"
                                multiline
                                rows={2}
                                defaultValue="Default Value"
                            />
                        </Grid>


                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Button type="submit" variant='contained' size='large' color='success'>Guardar</Button>
                    <Button variant='outlined' color='inherit' size='large' onClick={() => handleClose(false)}>Cerrar</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default CustomerDialog