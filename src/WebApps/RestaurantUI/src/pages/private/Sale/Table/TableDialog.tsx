
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { useSaleStore } from '@/stores';
import { Box, Button, DialogActions, DialogContent, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Switch, Tab, Tabs, styled, tabsClasses } from '@mui/material';
import { Floor, Room, TableReadDto } from '@/core/models';
import { useEffect, useRef, useState } from 'react';
import TableBarIcon from '@mui/icons-material/TableBar';
import { SaleService as saleSvc, getEstabs, tableService } from '@/core/services';
import Swal from 'sweetalert2';
import { hideLoader, showLoader } from '@/spinner';
import { SnackbarUtility } from '@/core/utilities';

export interface SimpleDialogProps {
    open: boolean;
    onClose: (value: boolean) => void;
}

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}
// const Item = styled(Paper)(({ theme }) => ({
//     backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//     ...theme.typography.h5,
//     padding: theme.spacing(3),
//     textAlign: 'center',
//     color: theme.palette.text.secondary,
//     cursor: 'pointer',
//     transition: 'background-color 0.3s ease', // Agrega la transición
//     '&:hover': {
//         backgroundColor: theme.palette.mode === 'dark' ? '#27323A' : '#f5f5f5', // Cambia el color en hover
//     },
// }));

const CustomButton = styled(Button)(({ theme }) => ({
 //   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.h5,
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? '#27323A' : '#f5f5f5',
    },
}));


const TableDialog = (props: SimpleDialogProps) => {
    const establecimientos = getEstabs(); 
    const setOrder = useSaleStore(state => state.setSummary);
    const order = useSaleStore(state => state.order);

    const [floors, setFloors] = useState<Array<Floor>>([]); //Piso  
    const [rooms, setRooms] = useState<Array<Room>>([]); //Sala   
    const [tables, setTables] = useState<Array<TableReadDto>>([]); // Mesas 

    const { onClose, open } = props;

    const [floorId, setFloorId] = useState<number | undefined>(0)
    const [roomId, setRoomId] = useState<number | undefined>(0) 
    const tempRooms = useRef<Array<Room>>([]);
    const tempTables = useRef<Array<TableReadDto>>([]);
 
    const handleClose = () => {
        onClose(false);
    }; 

    const getDataForForm = () => {
        const codEstab = establecimientos.find(eee => eee.idEstablecimiento === order.establecimientoId)?.codEstab;
        showLoader();
        return saleSvc.getDataForForm(JSON.stringify({
            codEstab
        })).finally(() => hideLoader())
    }

    useEffect(() => {  
        if (!open) return
        //Get Tables 
        getDataForForm().then(response => {
            const { floors, rooms, tables } = response;
            const tempFloorId = (floors.length > 0 ? floors[0]?.id : 0)
            const tempRoomsFiltered = rooms.filter(room => room.floorId === tempFloorId);
            const tempRoomId = (tempRoomsFiltered.length > 0 ? tempRoomsFiltered[0]?.id : 0);
            const tempTablesFiltered = tables.filter(table => table.roomId === tempRoomId);

            //Set Temp Arrays
            tempRooms.current = rooms;
            tempTables.current = tables;

            setFloors(() => floors);
            setRooms(() => tempRoomsFiltered);
            setTables(() => tempTablesFiltered)

            setFloorId(() => tempFloorId);
            setRoomId(() => tempRoomId);

            console.log(response)
        }).finally(() => hideLoader())

    }, [open]);



    const handleButtonClick = (table: TableReadDto) => { 
        setOrder({
            ...order,
            tableId: table.tableId,
            table: {
                tableName: table.description,
                numberTable: table.numberTable
            }
        }) 
        handleClose()
    };

    const handleChangeFloor = (id: number) => {
        const tempRoomsFiltered = tempRooms.current.filter(room => room.floorId === id);
        const tempRoomId = (tempRoomsFiltered.length > 0 ? tempRoomsFiltered[0]?.id : 0);
        const tempTablesFiltered = tempTables.current.filter(table => table.roomId === tempRoomId);

        setRooms(() => tempRoomsFiltered)
        setTables(() => tempTablesFiltered)

        setFloorId(() => id);
        setRoomId(() => tempRoomId);

    }

    const handleChangeChecked = async (obj: TableReadDto) => {
        try {
            const { isConfirmed } = await Swal.fire({
                icon: 'warning',
                html: 'Esta seguro de liberar la mesa'
            })
            if (isConfirmed) {
                showLoader();
                tableService.putStateAssigned(obj.tableId, {
                    id: obj.tableId,
                    description: obj.description,
                    roomId: obj.roomId,
                    assigned: false
                }).then(response => {
                    if (response.status === 200) {
                        getDataForForm().then(response => {
                            const { tables } = response;
                            const tempTablesFiltered = tables.filter(table => table.roomId === roomId);
                            //Set Temp Arrays 
                            tempTables.current = tables;
                            setTables(() => tempTablesFiltered)
                        })
                        SnackbarUtility.success(response.data)
                    }
                    console.log(response)
                }).finally(() => hideLoader())
            }
        } catch (error) {
            console.log(error)
        } 
    }
    return (
        <Dialog onClose={handleClose} open={open} fullWidth={true}>
            <DialogTitle>
                Mesas
            </DialogTitle> 
            <DialogContent dividers>
                {
                    floors.length > 0 && (
                        <FormControl fullWidth>
                            <InputLabel id="select-floor-label">Piso</InputLabel>
                            <Select
                                labelId="select-floor-label"
                                id="floor-select"
                                label="Piso"
                                value={floorId}
                                onChange={(e) => handleChangeFloor(Number(e.target.value))}
                            >
                                {
                                    floors.map((floor, floorIndex) => {
                                        return <MenuItem value={floor.id} key={floorIndex}>{floor.description}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    )
                }

                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        p: 1
                    }}
                >
                    <Tabs 
                        variant="scrollable"
                        scrollButtons
                        aria-label="visible arrows tabs example"
                        textColor="secondary"
                        indicatorColor="secondary"
                        sx={{
                            [`& .${tabsClasses.scrollButtons}`]: {
                                '&.Mui-disabled': { opacity: 0.3 },
                            },
                            mt: 2,
                            mb: 2
                        }}
                    >
                        {
                            rooms.map((room, roomIndex) => (
                                <Tab label={room.description} {...a11yProps(room.id)} key={roomIndex} />
                            ))
                        }
                    </Tabs>

                    <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        {tables.map((table, index) => (
                            <Grid item xs={4} sm={4} md={4} key={index}>
                                <CustomButton 
                                variant={order.tableId > table.tableId ? "contained" : "outlined"} 
                                fullWidth 
                                disabled={table.assigned}
                                onClick={()=>handleButtonClick(table)}
                                 >
                                    {table.numberTable} <TableBarIcon />
                                </CustomButton>
                                {/* <Item onClick={() => handleButtonClick(table, index)} style={{
                                    backgroundColor: `${order.tableId === table.tableId ? '#1976d2' : '#818181'}`,
                                    color: `${order.tableId === table.tableId ? 'white' : 'white'}`,
                                }}>{table.numberTable}
                                    <TableBarIcon />
                                </Item>
                                */}
                                {
                                    table.assigned && (
                                        <FormControlLabel control={<Switch
                                            checked={table.assigned}
                                            onChange={() => handleChangeChecked(table)}
                                            value="checked"
                                            color="primary" />} label="Ocupado" />
                                    )
                                }

                            </Grid>
                        ))}
                    </Grid>

                </Box> 
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} size="large" variant='contained'>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TableDialog
