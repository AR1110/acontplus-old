
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { EditIcon, PersonAddAltTwoToneIcon, InfoIcon } from '@/core/components/IconsMaterial';
import { IconButton, Stack, Tooltip } from '@mui/material';
import { useRef, useState } from 'react';
import { CustomerReadDto } from '@/core/models';
import { customerService } from '@/core/services';
import HtmlTooltip from '@/core/components/HtmlTooltip';
import { CustomerInfo } from './CustomerInfo';
import CustomerDialog from './CustomerDialog';

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

    const customerDialogClose = (customerData?: CustomerReadDto) => {
        if(customerData){
            onChangeCustomer({
                customerName: customerData?.fiscalName ?? "",
                customerCompanyId: customerData?.customerCompanyId ?? 0,
            })  
        }
        setOpenCustomerDialog(false) 
    }

    return (
        <>
            <Autocomplete
                value={customerName}
                onInputChange={handleInputChange}
                onChange={(_e, _v, _r, details) => {
                    const customerData = details?.option;
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
                                            refCustomerCompanyId.current = 0;
                                            setOpenCustomerDialog(true);
                                        }}>
                                            <PersonAddAltTwoToneIcon color='success' sx={{ fontSize: 30 }} />
                                        </IconButton>
                                    </Tooltip>
                                    {
                                        refCustomerCompanyId.current > 0 && (
                                            <>
                                                <Tooltip title="Editar Cliente">
                                                    <IconButton onClick={() => {
                                                        refCustomerCompanyId.current = customerCompanyId;
                                                        setOpenCustomerDialog(true)
                                                    }}>
                                                        <EditIcon color='warning' sx={{ fontSize: 30 }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <HtmlTooltip placement="bottom-start" title={
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
                openCustomerDialog && <CustomerDialog open={openCustomerDialog} handleClose={customerDialogClose} id={refCustomerCompanyId.current} />
            }
        </>
    );
}

export default CustomerSearch;