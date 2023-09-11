import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { EditIcon, PersonAddAltTwoToneIcon } from '@/core/components/IconsMaterial';
import { IconButton } from '@mui/material';
import { useRef, useState } from 'react';
import { CustomerReadDto } from '@/core/models';
import { CustomerService } from '@/core/services';
import { useSaleStore } from '@/stores';
import CustomerDialog from './CustomerDialog';

const CustomerSearch = () => {
    const [customers, setCustomers] = useState<Array<CustomerReadDto>>([]);
    const order = useSaleStore(state => state.order)
    const setOrder = useSaleStore(state => state.setSummary);
    const customerCompanyId = useRef(order.customerCompanyId)
    //Modals 
    const [openCustomerDialog, setOpenCustomerDialog] = useState(false);

    const customerSearch = (textSearch: string) => {
        if (textSearch.length < 2) return
        setCustomers([])
        CustomerService.search(textSearch).then(response => {
            setCustomers(response)
        }).finally(() => {
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
                freeSolo
                value={order.customerName}
                onInputChange={handleInputChange}
                options={customers.map((option) => option.fiscalName)}
                id="customerSearch"
                onChange={(_, newValue,) => {
                    const customerData = customers.find(
                        customer => customer.fiscalName === newValue
                    );
                    //Gestionar el agregar o actualizar clinte
                    customerCompanyId.current = customerData?.customerCompanyId ?? 0;

                    setOrder({
                        ...order,
                        customerName: newValue ?? "",
                        customerCompanyId: customerData?.customerCompanyId ?? 0,
                    })
                }}
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
                                <>
                                    {params.InputProps.endAdornment}
                                    <IconButton onClick={() => {
                                        customerCompanyId.current = 0;
                                        setOpenCustomerDialog(true);
                                    }}>
                                        <PersonAddAltTwoToneIcon />
                                    </IconButton>
                                    {
                                        order.customerCompanyId > 0 && (
                                            <>
                                                <IconButton onClick={() => {
                                                    customerCompanyId.current = order.customerCompanyId;
                                                    setOpenCustomerDialog(true)
                                                }}> <EditIcon />
                                                </IconButton>
                                            </>
                                        )
                                    }

                                </>
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