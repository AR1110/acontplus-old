import { CustomerReadDto } from '@/core/models';
import { customerService } from '@/core/services';
import { Box, Skeleton, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

type CustomerInfoProps = {
    id: number
}
export const CustomerInfo = ({ id }: CustomerInfoProps) => {
    const [data, setData] = useState<CustomerReadDto>({} as CustomerReadDto);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    useEffect(() => {
        console.log(id)
        console.log('init customer ingo')
        customerService.getId(id).then(response => {            
            setData(response)
            setLoading(false)
        }).catch(()=>setError(true))
        return () => {
            console.log('dead component')
        }
    }, [])

    if(error) return <>Algo salio mal</>

    if (loading) {
        return (
            <Box sx={{ width: 200 }}>
                <Skeleton />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
            </Box>
        )
    }
    return (
        <>
            <Stack>
                <Typography variant="caption" gutterBottom>
                    <strong>Nombre Fiscal:</strong> {data.fiscalName}
                </Typography>
                <Typography variant="caption" gutterBottom>
                    <strong>Nombre Comercial:</strong> {data.tradeName}
                </Typography>
                <Typography variant="caption" gutterBottom>
                    <strong>Correo:</strong>  {data.correo}
                </Typography>
                <Typography variant="caption" gutterBottom>
                    <strong>Teléfono:</strong> {data.telefono}
                </Typography>
                <Typography variant="caption" gutterBottom>
                    <strong>Dirección:</strong> {data.direccion}
                </Typography>
            </Stack>
        </>
    )
}
