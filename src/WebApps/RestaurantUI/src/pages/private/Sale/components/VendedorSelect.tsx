import { useSaleStore } from '@/stores';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { ChangeEventHandler } from 'react'

const currencies = [
    {
        value: 'USD',
        label: '$',
    },
    {
        value: 'EUR',
        label: '€',
    },
    {
        value: 'BTC',
        label: '฿',
    },
    {
        value: 'JPY',
        label: '¥',
    },
];

const VendedorSelect = () => {
    const [age, setAge] = React.useState('');
    const mainData = useSaleStore(state => state.dataForm)
    const order = useSaleStore(state => state.order);
    const setOrder = useSaleStore(state => state.setSummary)
    
    if(mainData.vendedores.length===0){
        return 'Cargando'
    }

    const onChangeVendedor = (userId:number)=>{ 
        setOrder({
            ...order, 
            userId
        }) 
    }

    return (
        <TextField
            id="vendedor"
            select
            label="Vendedor"
            value={order.userId}
            size='small'
            fullWidth
            onChange={(e)=>onChangeVendedor(Number(e.target.value))}
        >
            {
                mainData.vendedores.length > 0 && mainData.vendedores.map((vendedor, index) => (
                    <MenuItem key={index} value={vendedor.idUsuario}>
                        {vendedor.nombreUsuario}
                    </MenuItem>
                ))
            }
        </TextField>
    )
}

export default VendedorSelect