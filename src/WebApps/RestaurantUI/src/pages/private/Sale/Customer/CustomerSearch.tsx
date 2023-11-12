
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { EditIcon, PersonAddAltTwoToneIcon, InfoIcon } from '@/core/components/IconsMaterial';
import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import { useRef, useState } from 'react';
import { CustomerReadDto } from '@/core/models';
import { SharedService, customerService } from '@/core/services';
import { useSaleStore } from '@/stores';
import CustomerDialog from './CustomerDialog';
import HtmlTooltip from '@/core/components/HtmlTooltip';
import { CustomerInfo } from './CustomerInfo';
import { SnackbarUtility } from '@/core/utilities';
import { hideLoader, showLoader } from '@/spinner';

const CustomerSearch = () => {
    const [customers, setCustomers] = useState<Array<CustomerReadDto>>([]);
    const order = useSaleStore(state => state.order)
    const setOrder = useSaleStore(state => state.setSummary);
    const customerCompanyId = useRef(order.customerCompanyId);
    const dataCustomerSRI = useRef({
        numeroRuc: '',
        razonSocial: '',
        direccion: "",
        telefono: "",
        email: ""
    })
    //Modals 
    const [openCustomerDialog, setOpenCustomerDialog] = useState(false);

    const customerSearch = (textSearch: string) => {
        setCustomers([])
        if (textSearch.length < 2) return
        customerService.search(textSearch).then(response => {
            setCustomers(response)
        }).catch(() => {
            setCustomers([])
        })
            .finally(() => {
                console.log('finally')
            })
    }
    const handleInputChange = (_: any, value: string) => {
        customerSearch(value)
    };

    const customerDialogClose = (data?: CustomerReadDto) => {

        if (data) {
            setOrder({
                ...order,
                customerName: data.tradeName,
                customerCompanyId: data.customerCompanyId ?? 0
            })
        }
        setOpenCustomerDialog(false)
    }

    function verificarNumero(numero: any) {
        numero = numero ? numero.trim() : ""

        if (![10, 13].includes(numero.length)) return;

        if (isNaN(numero)) return

        if (numero.length === 13 && numero.slice(-3) !== "001") return;

        return true;
    }

    const onSearchToSRI = async function (event: any) {
        try {
            const textSearch = event.target.value;
            dataCustomerSRI.current = {
                numeroRuc: '',
                razonSocial: '',
                direccion: "",
                telefono: "",
                email: ""
            }
            if (
                event.key === 'Enter' &&
                (!(order.customerCompanyId > 0))) {

                if (!verificarNumero(textSearch)) return
                //Numero de RUC 
                if (textSearch.length === 13) {
                    try {
                        showLoader();
                        SharedService.checkClientSRIByRUC(textSearch).then(response => {
                            const { numeroRuc, razonSocial, direccion, telefono, email, error } = response; 
                            if (!numeroRuc) {
                                SnackbarUtility.info(error!)
                                return
                            }
                            dataCustomerSRI.current = {
                                numeroRuc,
                                razonSocial,
                                direccion: direccion!,
                                telefono: telefono!,
                                email: email!
                            }
                            setOpenCustomerDialog(true)
                        })
                            .catch(error => {
                                console.log(error)
                            })
                            .finally(() => {
                                hideLoader();
                            })
                    } catch (error) {
                        console.log(error);
                        hideLoader();
                    }
                }

                //Numero de Cedula 
                if (textSearch.length === 10) {
                    try {
                        showLoader();
                        SharedService.checkClientSRIByCedula(textSearch).then(response => {
                            const { identificacion, nombreCompleto, direccion, telefono, email, error } = response;
                            if (!identificacion || !nombreCompleto) {
                                SnackbarUtility.info(error!)
                                return
                            }
                            dataCustomerSRI.current = {
                                numeroRuc: identificacion,
                                razonSocial: nombreCompleto,
                                direccion: direccion!,
                                telefono: telefono!,
                                email: email!
                            }
                            setOpenCustomerDialog(true)

                        }).finally(() => {
                            hideLoader();
                        })
                    } catch (error) {
                        console.log(error);
                        hideLoader();
                    }
                }

            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Autocomplete
                value={order.customerName}
                onInputChange={handleInputChange}
                onChange={(_e, _v, _r, details) => {
                    const customerData = details?.option;
                    //Gestionar el agregar o actualizar clinte
                    customerCompanyId.current = customerData?.customerCompanyId ?? 0;

                    setOrder({
                        ...order,
                        customerName: customerData?.fiscalName ?? "",
                        customerCompanyId: customerData?.customerCompanyId ?? 0,
                    })
                }}

                selectOnFocus
                // clearOnBlur
                // handleHomeEndKeys
                id="customerSearch"
                options={customers}
                getOptionLabel={(option) => {
                    if (typeof option === 'string') {
                        return option;
                    }
                    return ` ${option.identificationNumber} - ${option.fiscalName}`
                }}
                renderOption={(props, option) => <li {...props}>{option.identificationNumber} - {option.fiscalName}</li>}
                freeSolo
                onKeyDown={onSearchToSRI}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        size='small'
                        label="Buscar cliente"
                        variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                            type: "text",
                            endAdornment: (
                                <Stack direction="row"
                                    justifyContent="center"
                                    alignItems="flex-end">
                                    {/* {params.InputProps.endAdornment} */}
                                    <Tooltip title="Nuevo Cliente">
                                        <IconButton onClick={() => {
                                            customerCompanyId.current = 0;
                                            dataCustomerSRI.current = {
                                                numeroRuc: '',
                                                razonSocial: '',
                                                direccion: "",
                                                telefono: "",
                                                email: ""
                                            }
                                            setOpenCustomerDialog(true);
                                        }}>
                                            <PersonAddAltTwoToneIcon color='success' sx={{ fontSize: 30 }} />
                                        </IconButton>
                                    </Tooltip>
                                    {
                                        order.customerCompanyId > 0 && (
                                            <> <Tooltip title="Editar Cliente">
                                                <IconButton onClick={() => {
                                                    customerCompanyId.current = order.customerCompanyId;
                                                    dataCustomerSRI.current = {
                                                        numeroRuc: '',
                                                        razonSocial: '',
                                                        direccion: "",
                                                        telefono: "",
                                                        email: ""
                                                    }
                                                    setOpenCustomerDialog(true)

                                                }}>
                                                    <EditIcon color='warning' sx={{ fontSize: 30 }} />
                                                </IconButton>
                                            </Tooltip>
                                                <HtmlTooltip placement="bottom-start" title={
                                                    <CustomerInfo id={order.customerCompanyId} />
                                                }>
                                                    <IconButton>
                                                        <InfoIcon color='info' sx={{ fontSize: 30 }} />
                                                    </IconButton>
                                                </HtmlTooltip>
                                            </>
                                        )
                                    }

                                </Stack>
                            ),
                        }}
                    />
                )}
            />
            {
                openCustomerDialog && <CustomerDialog
                    open={openCustomerDialog}
                    handleClose={customerDialogClose}
                    dataCustomerSRI={dataCustomerSRI.current}
                    id={customerCompanyId.current} />
            }
        </>
    );
}

export default CustomerSearch;