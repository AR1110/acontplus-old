import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { EditIcon, PersonAddAltTwoToneIcon, InfoIcon } from '@/core/components/IconsMaterial';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { CustomerReadDto } from '@/core/models';
import { customerService } from '@/core/services';
import { useSaleStore } from '@/stores';
import CustomerDialog from './CustomerDialog';
import HtmlTooltip from '@/core/components/HtmlTooltip';
import { CustomerInfo } from './CustomerInfo';

const filter = createFilterOptions<CustomerReadDto>();

const CustomerSearch = () => {
    const [customers, setCustomers] = useState<Array<CustomerReadDto>>([]);
    const order = useSaleStore(state => state.order)
    const setOrder = useSaleStore(state => state.setSummary);
    const customerCompanyId = useRef(order.customerCompanyId)
    //Modals 
    const [openCustomerDialog, setOpenCustomerDialog] = useState(false);

    const customerSearch = (textSearch: string) => {
        setCustomers([])
        if (textSearch.length < 2) return
        customerService.search(textSearch).then(response => {
            console.log(response)
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

    return (
        <>
            <Autocomplete
                value={order.customerName}
                onInputChange={handleInputChange}
                onChange={(_, newValue) => { 
                    const customerData = customers.find(
                        customer => customer.fiscalName === newValue
                    );
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
                                                    setOpenCustomerDialog(true)
                                                }}>
                                                    <EditIcon color='warning' sx={{ fontSize: 30 }} />
                                                </IconButton>
                                            </Tooltip>
                                                <HtmlTooltip placement="bottom-start" title={
                                                    <CustomerInfo id={order.customerCompanyId} />
                                                }>
                                                    <IconButton onClick={() => {
                                                        customerCompanyId.current = order.customerCompanyId;
                                                        setOpenCustomerDialog(true)
                                                    }}>
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
                openCustomerDialog && <CustomerDialog open={openCustomerDialog} handleClose={customerDialogClose} id={customerCompanyId.current} />
            }
        </>
    );
}

export default CustomerSearch;