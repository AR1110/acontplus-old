import { SRI_IDENTIFITION_CODE } from '@/core/constants'
import { CustomerCreateDto, CustomerReadDto, TiempoCredito, TipoContribuyente, TipoIdentificacion } from '@/core/models'
import { CustomerService, SharedService } from '@/core/services'
import { SnackbarUtility } from '@/core/utilities'
import { useLoaderStore } from '@/stores'
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, IconButton, InputAdornment, MenuItem, Switch, Tab, Tabs, TextField } from '@mui/material'


import { useFormik } from 'formik'
import React, { SyntheticEvent, useEffect, useState } from 'react'
import * as yup from 'yup';
type CustomDialogProp = {
    id?: number
    open: boolean
    handleClose(data?: CustomerReadDto): void
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ mt: 2 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const CustomerDialog = ({ id = 0, open, handleClose }: CustomDialogProp) => {
    const { showLoader } = useLoaderStore();
    const [tiposIdentificacion, setTiposIdentificacion] = useState<Array<TipoIdentificacion>>([])
    const [tipoContribuyentes, setTipoContribuyentes] = useState<Array<TipoContribuyente>>([])
    const [tiempoCreditos, setTiempoCreditos] = useState<Array<TiempoCredito>>([])
    const [isSearchSRI, setIsSearchSRI] = useState(true);
    //Tabs
    const [value, setValue] = useState(1);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const validationSchema = yup.object({
        idTipoIdentificacion: yup
            .number()
            .required("Seleccione el Tipo Identificación"),
        numeroIdentificacion: yup
            .string()
            .required("Ingrese Número de Identificación")
            .test("numeroIdentificacionValido", "Número de Identificación no válido", async (numeroIdentificacion, Schema) => {
                const dataIdentification = tiposIdentificacion.find(
                    obj => obj.idTipoIdentificacion === Schema.parent.idTipoIdentificacion
                )

                if (dataIdentification?.codigoSri === SRI_IDENTIFITION_CODE.RUC) {
                    if (numeroIdentificacion.length !== 13) return false;
                    if (numeroIdentificacion.slice(numeroIdentificacion.length - 3) !== '001') return false;
                }

                if (dataIdentification?.codigoSri === SRI_IDENTIFITION_CODE.LICENSE) {
                    if (numeroIdentificacion.length !== 10) return false;
                }
                console.log(dataIdentification)

                return true; // No se aplica validación si idTipoIdentificacion es 10
            }),
        nombreFiscal: yup
            .string()
            .required("Ingrese el Nombre Fiscal"),
        nombreComercial: yup
            .string()
            .required("Ingrese el Nombre Fiscal")
    });


    const initialValues: CustomerCreateDto = {
        idCliente: 0,
        idTipoIdentificacion: 0,
        idTiempoCredito: 0,
        idSubContribuyente: 0,
        numeroIdentificacion: '',
        nombreFiscal: '',
        nombreComercial: '',
        codigoSri: SRI_IDENTIFITION_CODE.RUC
    }

    const successResponse = async (response: any)=>{
        console.log(response)
        if (response.code === "0") {
            SnackbarUtility.warning(response.message)
        }
        if (response.code === "1") {
            SnackbarUtility.success(response.message);
            const customerCompanyId = id > 0 ? id : response.payload;
            const customerData = await CustomerService.getId(customerCompanyId);
            handleClose(customerData);
        }
    }

    const formik = useFormik({
        initialValues,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            showLoader(true)
             

            if(id> 0){
                CustomerService.put(values.idCliente, {
                    ...values,
                    correo: "",
                    telefono: "",
                    placa: ""
                })
                .then(successResponse)
                .finally(()=>showLoader(false))
            }
            if(!(id>0)){
                CustomerService.post(values)
                .then(successResponse)
                .finally(() => showLoader(false))
            }
        },
    });

    const onLoad = async () => {
        showLoader(true)
        await CustomerService.getDataForm().then(response => {
            setTiposIdentificacion(() => response.tipoIdentificacion)
            setTipoContribuyentes(response.tipoContribuyentes)
            setTiempoCreditos(response.tiempoCreditos);

            if (!(id > 0)) {



                if (response.tipoIdentificacion.length > 0) {
                    // formik.setValues() 
                    formik.setFieldValue(
                        "idTipoIdentificacion",
                        response.tipoIdentificacion.find(obj => obj.codigoSri === "04")?.idTipoIdentificacion
                    )
                }
                if (response.tipoContribuyentes.length > 0) {
                    formik.setFieldValue(
                        "idSubContribuyente",
                        response.tipoContribuyentes.find(obj => obj.codigo === "06")?.idSubContribuyente
                    )
                }

                if (response.tiempoCreditos.length > 0) {
                    formik.setFieldValue(
                        "idTiempoCredito",
                        response.tiempoCreditos[0]?.idTiempoCredito
                    )
                }

            }
        }).finally(() => showLoader(false));


        if(id > 0){
            CustomerService.getId(id).then(response=>{
                console.log(response)
                formik.setValues(state=>{
                    return {
                        ...state,
                        idCliente: response.customerCompanyId,
                        numeroIdentificacion: response.identificationNumber,
                        nombreFiscal: response.fiscalName,
                        nombreComercial: response.tradeName,
                        idTipoIdentificacion: response.idTipoIdentificacion!,
                        idTiempoCredito: response.idTiempoCredito!,
                        idSubContribuyente: response.idSubContribuyente!,
                    }
                })
            })
        }

    }



    useEffect(() => {
        onLoad();
    }, [])

    function isNumber(valor: string): boolean {
        // Utilizamos una expresión regular para verificar si el valor es una secuencia de dígitos.
        // ^ indica el inicio de la cadena, $ indica el final de la cadena.
        // \d representa un dígito, y + indica que debe haber uno o más dígitos.
        const regex = /^\d+$/;
        return regex.test(valor);
    }

    const validateIDNumber = (numeroIdentificacion: string) => {

        numeroIdentificacion = numeroIdentificacion.trim();

        if (![10, 13].includes(numeroIdentificacion.length)) return;

        if (!isNumber(numeroIdentificacion)) return;

        if (numeroIdentificacion.length === 13 && numeroIdentificacion.slice(-3) !== "001") return;

        return true;
    }

    const executeSearchCustomerSRI = (numeroIdentificacion: string) => {
        //Si es RUC 
        if (
            numeroIdentificacion.length === 13 &&
            tiposIdentificacion.find(
                obj => obj.idTipoIdentificacion === formik.values.idTipoIdentificacion
            )?.codigoSri === SRI_IDENTIFITION_CODE.RUC) {
            //Buscar SRI 
            showLoader(true);
            SharedService.checkClientSRIByRUC(numeroIdentificacion).then(response => {
                const { numeroRuc, razonSocial, direccion, telefono, email, error } = response;
                if (!numeroRuc) {
                    SnackbarUtility.warning(error!)
                    return
                }

                formik.setValues({
                    ...formik.values,
                    numeroIdentificacion,
                    idCliente: 0,
                    nombreComercial: razonSocial,
                    nombreFiscal: razonSocial,
                    direccion,
                    emails: email,
                    telefonos: telefono
                })
            }).finally(() => showLoader(false))
        }

        //Si es Cedula 
        if (
            numeroIdentificacion.length === 10 &&
            tiposIdentificacion.find(
                obj => obj.idTipoIdentificacion === formik.values.idTipoIdentificacion
            )?.codigoSri === SRI_IDENTIFITION_CODE.LICENSE
        ) {
            //Buscar SRI 
            showLoader(true);
            SharedService.checkClientSRIByCedula(numeroIdentificacion).then(response => {
                console.log(response)
                const { direccion, email, error, nombreCompleto, telefono } = response;
                if (response.nombreCompleto) {
                    SnackbarUtility.warning(error!);
                    return
                }
                formik.setValues({
                    ...formik.values,
                    numeroIdentificacion,
                    idCliente: 0,
                    nombreComercial: nombreCompleto,
                    nombreFiscal: nombreCompleto,
                    direccion,
                    emails: email,
                    telefonos: telefono
                })

            }).finally(() => showLoader(false))
        }
    }


    const customerSearchSRI = async (numeroIdentificacion: string) => {
        const dataIdentification = tiposIdentificacion.find(
            obj => obj.idTipoIdentificacion === formik.values.idTipoIdentificacion
        )

        if (
            (dataIdentification?.codigoSri === SRI_IDENTIFITION_CODE.RUC) ||
            (dataIdentification?.codigoSri === SRI_IDENTIFITION_CODE.LICENSE)
        ) {
            //Validacion de Numero y si es cedula o RUC
            if (validateIDNumber(numeroIdentificacion)) {
                const isCustomerRegistered = await CustomerService.isCustomerRegistered({
                    textSearch: numeroIdentificacion
                })

                if (!isCustomerRegistered && isSearchSRI) {
                    executeSearchCustomerSRI(numeroIdentificacion);
                }

            }

        }

        formik.setFieldValue("numeroIdentificacion", numeroIdentificacion)
    }

    return (
        <Dialog open={open} onClose={() => handleClose()} fullWidth>
            <form onSubmit={formik.handleSubmit} autoComplete='off'>
                <DialogTitle>Nuevo Cliente</DialogTitle>
                <DialogContent dividers>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="wrapped label tabs example"
                    >
                        <Tab
                            value={1}
                            label="General"
                            wrapped
                        />
                        <Tab value={2} label="Adicionales" />
                    </Tabs>

                    <TabPanel value={value} index={1}>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                            <Grid item xs={2} sm={6} md={4}>
                                {
                                    tiposIdentificacion.length > 0 && <TextField fullWidth
                                        id="idTipoIdentificacion"
                                        name="idTipoIdentificacion"
                                        select
                                        value={formik.values.idTipoIdentificacion > 0 ? formik.values.idTipoIdentificacion : ''}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.idTipoIdentificacion && Boolean(formik.errors.idTipoIdentificacion)}
                                        helperText={formik.touched.idTipoIdentificacion && formik.errors.idTipoIdentificacion}
                                    >
                                        {
                                            tiposIdentificacion.map((item, index) => (
                                                <MenuItem value={item.idTipoIdentificacion} key={index}>
                                                    {item.descripcion}
                                                </MenuItem>
                                            ))
                                        }


                                    </TextField>
                                }
                            </Grid>
                            <Grid item xs={2} sm={6} md={8}>
                                <TextField
                                    fullWidth
                                    required
                                    autoFocus
                                    label="Nro. Identificación"
                                    id="numeroIdentificacion"
                                    name="numeroIdentificacion"
                                    value={formik.values.numeroIdentificacion}
                                    onChange={(e) => {
                                        customerSearchSRI(e.target.value)
                                    }}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.numeroIdentificacion && Boolean(formik.errors.numeroIdentificacion)}
                                    helperText={formik.touched.numeroIdentificacion && formik.errors.numeroIdentificacion}
                                    InputProps={{
                                        endAdornment:
                                            <FormControlLabel label="SRI" control={
                                                <Switch defaultChecked size="small" onChange={() => {
                                                    setIsSearchSRI(() => !isSearchSRI)
                                                }} aria-label='SRI' />
                                            } />

                                    }}

                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Nombre Fiscal"
                                    id="nombreFiscal"
                                    name="nombreFiscal"
                                    value={formik.values.nombreFiscal}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        formik.setFieldValue("nombreComercial", e.target.value)
                                    }}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.nombreFiscal && Boolean(formik.errors.nombreFiscal)}
                                    helperText={formik.touched.nombreFiscal && formik.errors.nombreFiscal}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={12}>
                                <TextField fullWidth
                                    label="Dirección"
                                    multiline
                                    rows={2}
                                    id="direccion"
                                    name="direccion"
                                    value={formik.values.direccion}
                                    onChange={formik.handleChange}
                                />
                            </Grid>


                        </Grid>
                    </TabPanel>

                    <TabPanel value={value} index={2}>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                            <Grid item xs={12} sm={12} md={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Nombre Fiscal"
                                    id="nombreComercial"
                                    name="nombreComercial"
                                    value={formik.values.nombreComercial}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.nombreComercial && Boolean(formik.errors.nombreComercial)}
                                    helperText={formik.touched.nombreComercial && formik.errors.nombreComercial}
                                />
                            </Grid>

                            <Grid item xs={2} sm={6} md={6}>
                                {
                                    tipoContribuyentes.length > 0 && <TextField fullWidth
                                        id="idSubContribuyente"
                                        name="idSubContribuyente"
                                        select
                                        value={formik.values.idSubContribuyente > 0 ? formik.values.idSubContribuyente : ''}
                                        onChange={formik.handleChange}
                                    >
                                        {
                                            tipoContribuyentes.map((item, index) => (
                                                <MenuItem value={item.idSubContribuyente} key={index}>
                                                    {item.descripcion}
                                                </MenuItem>
                                            ))
                                        }


                                    </TextField>
                                }
                            </Grid>

                            <Grid item xs={2} sm={6} md={6}>
                                {
                                    tiempoCreditos.length > 0 && <TextField fullWidth
                                        id="idTiempoCredito"
                                        name="idTiempoCredito"
                                        select
                                        value={formik.values.idTiempoCredito > 0 ? formik.values.idTiempoCredito : ''}
                                        onChange={formik.handleChange}
                                    >
                                        {
                                            tiempoCreditos.map((item, index) => (
                                                <MenuItem value={item.idTiempoCredito} key={index}>
                                                    {item.descripcion}
                                                </MenuItem>
                                            ))
                                        }


                                    </TextField>
                                }
                            </Grid>
                        </Grid>
                    </TabPanel>





                </DialogContent>
                <DialogActions>
                    <Button type="submit" variant='contained' size='large' color='success'>Guardar</Button>
                    <Button variant='outlined' color='inherit' size='large' onClick={() => handleClose()}>Cerrar</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default CustomerDialog