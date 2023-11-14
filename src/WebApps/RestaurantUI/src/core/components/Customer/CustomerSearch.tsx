
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { EditIcon, PersonAddAltTwoToneIcon, InfoIcon } from '@/core/components/IconsMaterial';
import { IconButton, Stack, Tooltip } from '@mui/material';
import { useRef, useState } from 'react';
import { CustomerReadDto } from '@/core/models';
import { SharedService, customerService } from '@/core/services';
import HtmlTooltip from '@/core/components/HtmlTooltip';
import { CustomerInfo } from './CustomerInfo';
import CustomerDialog from './CustomerDialog';
import { hideLoader, showLoader } from '@/spinner';
import { SnackbarUtility } from '@/core/utilities';
import Swal from 'sweetalert2';

type CustomerSearchProps = {
    customerCompanyId: number
    customerName: string
    onChangeCustomer(data:any): void
}
const CustomerSearch = ({ customerCompanyId, customerName, onChangeCustomer }: CustomerSearchProps) => {
    const [customers, setCustomers] = useState<Array<CustomerReadDto>>([]); 
    const refCustomerCompanyId = useRef(customerCompanyId)
  
    //Modals 
    const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
    const [openTooltip, setOpenTooltip] = useState(false)

    const dataCustomerSRI = useRef({
        numeroRuc: '',
        razonSocial: '',
        direccion: "",
        telefono: "",
        email: ""
    })

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
    const handleInputChange = (_:any, value: string) => {
        customerSearch(value)
    };

    const customerDialogClose = (customerData?: CustomerReadDto) => {
        if(customerData){
            onChangeCustomer({
                customerName: customerData?.fiscalName ?? "",
                customerCompanyId: customerData?.customerCompanyId ?? 0,
            })  
        }
        refCustomerCompanyId.current = customerCompanyId > 0 ? customerCompanyId : 0
        setOpenCustomerDialog(false) 
    }

    function verificarNumero(numero: any) {
        numero = numero ? numero.trim() : ""

        if (![10, 13].includes(numero.length)) return;

        if (isNaN(numero)) return

        if (numero.length === 13 && numero.slice(-3) !== "001") return;

        return true;
    }

    const showAlertConfirmID = (textSearch: string) => {
        Swal.fire({
            //title: "Are you sure?",
            html: `Desea registrar este numero de identificacion: ${textSearch} como <b>PASAPORTE</b>?`,
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí!",
            cancelButtonText: 'No!'
        }).then(result => {
            if (result.isConfirmed) {
                console.log('dhoidhf')
                dataCustomerSRI.current = {
                    numeroRuc: textSearch,
                    razonSocial: "",
                    direccion: "",
                    telefono: "",
                    email: ""
                }
                setOpenCustomerDialog(true)
            }
        })
    }
    const onSearchToSRI = async function (textSearch: string) {
        try {

            if (!(customerCompanyId > 0)) {
                const isValidID = verificarNumero(textSearch);
                if (!isValidID) {
                    showAlertConfirmID(textSearch)
                    return
                }

                const response = await customerService.search(textSearch);
                if (response.length > 0) {
                    SnackbarUtility.info('Selecciona al cliente de entre los clientes que se han encontrado!');
                    return
                }

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

    const onEnterCustomerSearch = (event: any) => {
        const textSearch = event.target.value;
        dataCustomerSRI.current = {
            numeroRuc: '',
            razonSocial: '',
            direccion: "",
            telefono: "",
            email: ""
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            onSearchToSRI(textSearch)
        }

    }

    const onClickNewCustomer = () => {
        try {
            const elem = document.getElementById('customerSearch') as HTMLInputElement;
            const textSearch = elem.value; 
            refCustomerCompanyId.current = 0;
            dataCustomerSRI.current = {
                numeroRuc: '',
                razonSocial: '',
                direccion: "",
                telefono: "",
                email: ""
            }
            if (textSearch) {
                onSearchToSRI(textSearch)
            } else {
                setOpenCustomerDialog(true)
            }
        } catch (error) {
            console.log(console.error());
        }
    }

    const handleTooltipInfo = () => {
        setOpenTooltip((state) => !state);
    };

    return (
        <>
            <Autocomplete
                value={customerName}
                onInputChange={handleInputChange}
                onChange={(_e, _v, _r, details) => {
                    const customerData = details?.option;
                    console.log(customerData)
                    //Gestionar el agregar o actualizar clinte
                    refCustomerCompanyId.current = customerData?.customerCompanyId ?? 0;
 
                    onChangeCustomer({
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
                onKeyDown={onEnterCustomerSearch}
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
                                        <IconButton onClick={onClickNewCustomer}>
                                            <PersonAddAltTwoToneIcon color='success' sx={{ fontSize: 30 }} />
                                        </IconButton>
                                    </Tooltip>
                                    {
                                        customerCompanyId > 0 && (
                                            <>
                                                <Tooltip title="Editar Cliente">
                                                    <IconButton onClick={() => {
                                                        refCustomerCompanyId.current = customerCompanyId;
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
                                                <HtmlTooltip open={openTooltip} onClick={handleTooltipInfo} placement="bottom-start" title={
                                                    <CustomerInfo id={refCustomerCompanyId.current} />
                                                }>
                                                    <IconButton >
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
                id={refCustomerCompanyId.current} />
            }
        </>
    );
}

export default CustomerSearch;