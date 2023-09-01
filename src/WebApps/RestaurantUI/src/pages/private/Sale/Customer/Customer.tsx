import * as React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Autocomplete, {
    AutocompleteCloseReason,
    autocompleteClasses    
} from '@mui/material/Autocomplete';
import ButtonBase from '@mui/material/ButtonBase';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import { PersonAddAltTwoToneIcon } from '@/core/components';
import { useState } from 'react';
import { CustomerReadDto } from '@/core/models';
import { CustomerService } from '@/core/services';
import { useSaleStore } from '@/stores';
import CustomerDialog from './CustomerDialog';

interface PopperComponentProps {
    anchorEl?: any;
    disablePortal?: boolean;
    open: boolean;
}

const StyledAutocompletePopper = styled('div')(({ theme }) => ({
    [`& .${autocompleteClasses.paper}`]: {
        boxShadow: 'none',
        margin: 0,
        color: 'inherit',
        fontSize: 13,
    },
    [`& .${autocompleteClasses.listbox}`]: {
        backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#1c2128',
        padding: 0,
        [`& .${autocompleteClasses.option}`]: {
            minHeight: 'auto',
            alignItems: 'flex-start',
            padding: 8,
            borderBottom: `1px solid  ${theme.palette.mode === 'light' ? ' #eaecef' : '#30363d'
                }`,
            '&[aria-selected="true"]': {
                backgroundColor: 'transparent',
            },
            [`&.${autocompleteClasses.focused}, &.${autocompleteClasses.focused}[aria-selected="true"]`]:
            {
                backgroundColor: theme.palette.action.hover,
            },
        },
    },
    [`&.${autocompleteClasses.popperDisablePortal}`]: {
        position: 'relative',
    },
}));

function PopperComponent(props: PopperComponentProps) {
    const { disablePortal, anchorEl, open, ...other } = props;
    return <StyledAutocompletePopper {...other} />;
}

const StyledPopper = styled(Popper)(({ theme }) => ({
    border: `1px solid ${theme.palette.mode === 'light' ? '#e1e4e8' : '#30363d'}`,
    boxShadow: `0 8px 24px ${theme.palette.mode === 'light' ? 'rgba(149, 157, 165, 0.2)' : 'rgb(1, 4, 9)'
        }`,
    borderRadius: 6,
    width: 300,
    zIndex: theme.zIndex.modal,
    fontSize: 13,
    color: theme.palette.mode === 'light' ? '#24292e' : '#c9d1d9',
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#1c2128',
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
    padding: 10,
    width: '100%',
    borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#eaecef' : '#30363d'
        }`,
    '& input': {
        borderRadius: 4,
        backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#0d1117',
        padding: 8,
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        border: `1px solid ${theme.palette.mode === 'light' ? '#eaecef' : '#30363d'}`,
        fontSize: 14,
        '&:focus': {
            boxShadow: `0px 0px 0px 3px ${theme.palette.mode === 'light'
                ? 'rgba(3, 102, 214, 0.3)'
                : 'rgb(12, 45, 107)'
                }`,
            borderColor: theme.palette.mode === 'light' ? '#0366d6' : '#388bfd',
        },
    },
}));

const Button = styled(ButtonBase)(({ theme }) => ({
    fontSize: 13,
    width: '100%',
    textAlign: 'left',
    paddingBottom: 8,
    color: theme.palette.mode === 'light' ? '#586069' : '#8b949e',
    fontWeight: 600,
    '&:hover,&:focus': {
        color: theme.palette.mode === 'light' ? '#0366d6' : '#58a6ff',
    },
    '& span': {
        width: '100%',
    },
    '& svg': {
        width: 16,
        height: 16,
    },
}));

export default function Customer() {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [customerName, setCustomerName] = useState<any>("");
    //   const [pendingValue, setPendingValue] = React.useState>([]);
    const setOrder = useSaleStore(state => state.setSummary)
    const order = useSaleStore(state => state.order)
    const [customers, setCustomers] = useState<Array<CustomerReadDto>>([]);

    //Modals 
    const [openDialog, toggleOpenDialog] = useState(false);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        // setPendingValue(value);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        console.log('dkwhkjch wkjhfjkerf')
        // setValue(pendingValue);
        if (anchorEl) {
            anchorEl.focus();
        }
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'github-label' : undefined;

    const customerSearch = (textSearch: string) => {
        if (textSearch.length < 2) return
        setCustomers([])
        CustomerService.search(textSearch).then(response => {
            setCustomers(response)
        }).finally(() => {
            console.log('finally')
        })
        // console.log(event)
    }

    const handleInputChange = (_: any, value: string) => {        
        customerSearch(value)
    };

    return (
        <React.Fragment>
            <Box sx={{ width: 221, fontSize: 13 }}>
                <Button disableRipple aria-describedby={id} onClick={handleClick}>
                    <span>{order.customerCompanyId > 0 ? customerName : 'Seleccionar cliente'} </span>
                    <PersonAddAltTwoToneIcon />
                </Button>
            </Box>
            <StyledPopper id={id} open={open} anchorEl={anchorEl} placement="bottom-start">
                <ClickAwayListener onClickAway={handleClose}>
                    <div>
                        <Box
                            sx={{
                                borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#eaecef' : '#30363d'
                                    }`,
                                padding: '8px 10px',
                                fontWeight: 600,
                            }}
                        >
                            Clientes
                        </Box>
                        <Autocomplete
                            open

                            onInputChange={handleInputChange}
                            onClose={(_, reason: AutocompleteCloseReason) => {
                                if (reason === 'escape') {
                                    handleClose();
                                }
                            }}
                            onChange={(event, newValue, reason) => {
                                console.log('dkjhw cliekme')
                                if (event.type === 'keydown' && (event as React.KeyboardEvent).key === 'Backspace' && reason === 'removeOption') {
                                    return;
                                } 
                                console.log(newValue)
                                if(!(newValue?.identificationNumber)){
                                    handleClose()
                                    toggleOpenDialog(true);
                                    return
                                }

                                setCustomerName(newValue?.tradeName)
                                setOrder({
                                    ...order,
                                    customerCompanyId: newValue?.customerId ?? 0
                                })
                                handleClose()
                            }}
                            // clearOnBlur
                            // handleHomeEndKeys
                            //disableCloseOnSelect
                            PopperComponent={PopperComponent}
                            // renderTags={() => null} 
                            getOptionLabel={(option) => {
                                // e.g value selected with enter, right from the input
                                if (typeof option === 'string') {
                                    return option;
                                }
                                if (option.tradeName) {
                                    return option.tradeName;
                                }
                                return option.tradeName;
                            }}
                            filterOptions={(options, params) => {
                                if (params.inputValue !== '' && params.inputValue.length > 2) {
                                    customers.push({
                                        customerId: 0,
                                        taxName: "",
                                        identificationNumber: "",
                                        tradeName: `Add "${params.inputValue}"`,
                                    });
                                }

                                return customers;
                            }}
                            renderOption={(props, option) => ( 
                                <li {...props}> 
                                    <Box
                                        sx={{
                                            flexGrow: 1,
                                            '& span': {
                                                color:
                                                    theme.palette.mode === 'light' ? '#586069' : '#8b949e',
                                            },
                                        }}
                                    >
                                        {option.identificationNumber}
                                        <br />
                                        <span>{option.tradeName}</span>
                                    </Box> 
                                </li>
                            )}
                            options={customers}
                            renderInput={(params) => (
                                <StyledInput
                                    ref={params.InputProps.ref}
                                    inputProps={params.inputProps}
                                    autoFocus
                                    placeholder="Nro. identificación o el Nombre del cliente"
                                />
                            )}
                        />
                    </div>
                </ClickAwayListener>
            </StyledPopper>

           <CustomerDialog open={openDialog} handleClose={toggleOpenDialog}/>
        </React.Fragment>
    );
}

