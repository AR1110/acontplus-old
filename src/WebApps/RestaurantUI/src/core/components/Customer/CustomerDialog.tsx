import { SRI_IDENTIFITION_CODE } from '@/core/constants'
import { CustomerCreateDto, CustomerReadDto, TiempoCredito, TipoContribuyente, TipoIdentificacion } from '@/core/models'
import { customerService, SharedService } from '@/core/services'
import { SnackbarUtility } from '@/core/utilities'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, MenuItem, Switch, Tab, Tabs, TextField } from '@mui/material'


import { useFormik } from 'formik'
import { MuiChipsInput, MuiChipsInputChip } from 'mui-chips-input'
import React, { SyntheticEvent, useEffect, useState } from 'react'
import * as yup from 'yup';
import { showLoader, hideLoader } from '@/spinner'
type CustomDialogProp = {
    id?: number
    open: boolean
    handleClose(data?: CustomerReadDto): void
    dataCustomerSRI?: any
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

const CustomerDialog = ({ id = 0, open, handleClose, dataCustomerSRI }: CustomDialogProp) => {
    const [tiposIdentificacion, setTiposIdentificacion] = useState<Array<TipoIdentificacion>>([])
    const [tipoContribuyentes, setTipoContribuyentes] = useState<Array<TipoContribuyente>>([])
    const [tiempoCreditos, setTiempoCreditos] = useState<Array<TiempoCredito>>([])
    const [isSearchSRI, setIsSearchSRI] = useState(true);

    //Tabs
    const [value, setValue] = useState(1);
    const texFieldSize = "small"
    const handleChange = (_: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    //Email - cellphones 
    // const [emails, setEmails] = useState<string[]>([]);
    // const [phones, setPhones] = useState<string[]>([]);

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
        codigoSri: SRI_IDENTIFITION_CODE.RUC,
        correo: "",
        telefono: "",
        emails: [],
        telefonos: []
    }

    const successResponse = async (response: any) => {

        if (response.code === "0") {
            SnackbarUtility.warning(response.message)
        }
        if (response.code === "1") {
            SnackbarUtility.success(response.message);
            const customerCompanyId = id > 0 ? id : response.payload;
            const customerData = await customerService.getId(customerCompanyId);
            handleClose(customerData);
        }
    }

    const formik = useFormik({
        initialValues,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            showLoader()
            const data = {
                idCliente: values.idCliente,
                idTipoIdentificacion: values.idTipoIdentificacion,
                numeroIdentificacion: values.numeroIdentificacion,
                nombreFiscal: values.nombreFiscal,
                nombreComercial: values.nombreComercial,
                direccion: values.direccion,
                telefono: values.telefonos.length > 0 ? values.telefonos.join(';') : "",
                correo: values.emails.length > 0 ? values.emails.join(';') : "",
                idSubContribuyente: values.idSubContribuyente,
                idTiempoCredito: values.idTiempoCredito,
                placa: "",
                estado: true
            }

            if (id > 0) {
                customerService.put(values.idCliente, data)
                    .then(successResponse)
                    .finally(() => hideLoader())
            }
            if (!(id > 0)) {
                customerService.post(data)
                    .then(successResponse)
                    .finally(() => hideLoader())
            }
        },
    });

    const onLoad = async () => {
        showLoader()
        await customerService.getDataForm().then(response => {
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

            if (typeof dataCustomerSRI === 'object' && dataCustomerSRI.numeroRuc) {
                const {
                    numeroRuc,
                    razonSocial,
                    direccion,
                    telefono,
                    email
                } = dataCustomerSRI;
                let idTipoIdentificacion = 0;
                if (numeroRuc.length == 13) {
                    const dataID = response.tipoIdentificacion.find(obj => obj.codigoSri === SRI_IDENTIFITION_CODE.RUC);
                    if (dataID) {
                        idTipoIdentificacion = dataID.idTipoIdentificacion;
                    }
                }
                if (numeroRuc.length === 10) {
                    const dataID = response.tipoIdentificacion.find(obj => obj.codigoSri === SRI_IDENTIFITION_CODE.LICENSE);
                    if (dataID) {
                        idTipoIdentificacion = dataID.idTipoIdentificacion;
                    }
                }
                if (![13, 10].includes(numeroRuc.length)) {
                    const dataID = response.tipoIdentificacion.find(obj => obj.codigoSri === SRI_IDENTIFITION_CODE.PASSPORT);
                    if (dataID) {
                        idTipoIdentificacion = dataID.idTipoIdentificacion;
                    }
                }
                formik.setValues(state => {
                    return {
                        ...state,
                        direccion: direccion,
                        idCliente: 0,
                        idTipoIdentificacion: idTipoIdentificacion,
                        numeroIdentificacion: numeroRuc,
                        nombreFiscal: razonSocial,
                        nombreComercial: razonSocial,
                        emails: email ? email.split(';') : [],
                        telefonos: telefono ? telefono.split(';') : [],
                    }
                })
            }

            if (id > 0) {
                customerService.getId(id).then(response => {
                    formik.setValues(state => {
                        return {
                            ...state,
                            direccion: response.direccion,
                            idCliente: response.customerCompanyId,
                            numeroIdentificacion: response.identificationNumber,
                            nombreFiscal: response.fiscalName,
                            nombreComercial: response.tradeName,
                            idTipoIdentificacion: response.idTipoIdentificacion!,
                            idTiempoCredito: response.idTiempoCredito!,
                            idSubContribuyente: response.idSubContribuyente!,
                            emails: response.correo ? response.correo.split(';') : [],
                            telefonos: response.telefono ? response.telefono.split(';') : [],
                        }
                    })
                })
            }

        }).finally(() => hideLoader());
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
            showLoader();
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
                    correo: email,
                    telefono: telefono
                })
            }).finally(() => hideLoader())
        }

        //Si es Cedula 
        if (
            numeroIdentificacion.length === 10 &&
            tiposIdentificacion.find(
                obj => obj.idTipoIdentificacion === formik.values.idTipoIdentificacion
            )?.codigoSri === SRI_IDENTIFITION_CODE.LICENSE
        ) {
            //Buscar SRI 
            showLoader();
            SharedService.checkClientSRIByCedula(numeroIdentificacion).then(response => {


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
                    correo: email,
                    telefono: telefono
                })

            }).finally(() => hideLoader())
        }
    }


    const customerSearchSRI = async (numeroIdentificacion: string) => {
        formik.setFieldValue("numeroIdentificacion", numeroIdentificacion)
        const dataIdentification = tiposIdentificacion.find(
            obj => obj.idTipoIdentificacion === formik.values.idTipoIdentificacion
        )

        if (
            (dataIdentification?.codigoSri === SRI_IDENTIFITION_CODE.RUC) ||
            (dataIdentification?.codigoSri === SRI_IDENTIFITION_CODE.LICENSE)
        ) {
            //Validacion de Numero y si es cedula o RUC
            if (validateIDNumber(numeroIdentificacion)) {
                const isCustomerRegistered = await customerService.isCustomerRegistered({
                    textSearch: numeroIdentificacion
                })

                if (!isCustomerRegistered && isSearchSRI) {
                    executeSearchCustomerSRI(numeroIdentificacion);
                }

            }
        }


    }

    const handleEmailChange = (newValue: MuiChipsInputChip[]) => {
        formik.setFieldValue("emails", newValue)
    }
    const handlePhoneChange = (newValue: MuiChipsInputChip[]) => {
        formik.setFieldValue("telefonos", newValue)
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
                            <Grid item xs={12} sm={6} md={4}>
                                {
                                    tiposIdentificacion.length > 0 && <TextField fullWidth
                                        id="idTipoIdentificacion"
                                        name="idTipoIdentificacion"
                                        size={texFieldSize}
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
                            <Grid item xs={12} sm={6} md={8}>
                                <TextField
                                    size={texFieldSize}
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
                                    size={texFieldSize}
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
                                <TextField
                                    fullWidth
                                    size={texFieldSize}
                                    label="Dirección"
                                    id="direccion"
                                    name="direccion"
                                    variant="outlined"
                                    value={formik.values.direccion ?? ""}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}

                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <MuiChipsInput
                                    fullWidth
                                    size="small"
                                    label="Correo"
                                    variant="outlined"
                                    placeholder='Ingrese el correo y presione Enter para agregar'
                                    helperText={formik.values.emails.length > 0 ? "Haga doble clic para editar un correo" : ""}
                                    value={formik.values.emails}
                                    onChange={handleEmailChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <MuiChipsInput
                                    fullWidth
                                    size="small"
                                    label="Teléfono"
                                    variant="outlined"
                                    placeholder='Ingrese el # teléfono y presione Enter para agregar'
                                    helperText={formik.values.telefonos.length > 0 ? "Haga doble clic para editar un teléfono" : ""}
                                    value={formik.values.telefonos}
                                    onChange={handlePhoneChange}
                                />
                            </Grid>


                        </Grid>
                    </TabPanel>

                    <TabPanel value={value} index={2}>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                            <Grid item xs={12} sm={12} md={12}>
                                <TextField
                                    size={texFieldSize}
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

                            <Grid item xs={12} sm={6} md={6}>
                                {
                                    tipoContribuyentes.length > 0 && <TextField
                                        size={texFieldSize}
                                        fullWidth
                                        id="idSubContribuyente"
                                        name="idSubContribuyente"
                                        label="Tipo Contribuyente"
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

                            <Grid item xs={12} sm={6} md={6}>
                                {
                                    tiempoCreditos.length > 0 && <TextField
                                        size={texFieldSize}
                                        fullWidth
                                        id="idTiempoCredito"
                                        name="idTiempoCredito"
                                        select
                                        label="Tiempo Crédito"
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
                    <Button type="submit" variant='contained' size='large' color='success'>
                        {id > 0 ? 'Actualizar' : 'Guardar'}
                    </Button>
                    <Button variant='outlined' color='inherit' size='large' onClick={() => handleClose()}>Cerrar</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default CustomerDialog