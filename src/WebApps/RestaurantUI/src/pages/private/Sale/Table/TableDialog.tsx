 
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog'; 
import { useSaleStore } from '@/stores';
import { Box, DialogContent, Grid, Paper, Tab, Tabs, styled } from '@mui/material';
import { TableReadDto } from '@/core/models';
import { SyntheticEvent, useEffect, useState } from 'react'; 

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
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.h5,
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease', // Agrega la transición
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? '#27323A' : '#f5f5f5', // Cambia el color en hover
    },
}));

const TableDialog = (props: SimpleDialogProps) => {
    const dataForm = useSaleStore(state => state.dataForm);
    const setOrder = useSaleStore(state => state.setSummary);
    const order = useSaleStore(state => state.order);
    const [tables, setTables] = useState<Array<TableReadDto>>([]);
    // const [rooms, setRooms] = React.useState<Array<Room>>([]);
    const [value, setValue] = useState(0);

    const { onClose, open } = props;

    const tempFloors = dataForm.floors; // pisos
    // const tempRooms = dataForm.rooms; //Salas
    const tempTables = dataForm.tables;


    // const roomData = rooms.length > 0 ? rooms[0]: {} as Room;
    // const tables = dataForm.tables.find(table=>table.tableId)
    const handleClose = () => {
        onClose(false);
    };

    const handleChange = (_: SyntheticEvent, newValue: number) => {
        const tables = tempTables.filter(room => room.floorId === tempFloors[newValue]?.id)
        setTables(tables)        
        setValue(newValue);
    };

    useEffect(() => {
        if (tempFloors.length > 0) {
            const tables = tempTables.filter(room => room.floorId === tempFloors[0]?.id)
            setTables(tables)
        }
    }, [open]);

    const [selectedButton, setSelectedButton] = useState(null);

    const handleButtonClick = (tableId: number, index: any) => {
        setOrder({
            ...order,
            tableId
        })
        setSelectedButton(index);
    };

    return (
        <Dialog onClose={handleClose} open={open} fullWidth={true}>
            <DialogTitle>Mesas</DialogTitle>
            <DialogContent dividers>
                <Box
                    sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', maxHeight: 400 }}
                >
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        sx={{ borderRight: 1, borderColor: 'divider' }}
                    >
                        {
                            tempFloors.map((floor, index) => (
                                <Tab label={floor.description} {...a11yProps(floor.id)} key={index} />
                            ))
                        }

                    </Tabs>

                    <Box sx={{ flexGrow: 1, pl: 2 }}>
                        <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                            {tables.map((table, index) => (
                                <Grid item xs={2} sm={4} md={4} key={index}>
                                    <Item onClick={() => handleButtonClick(table.tableId, index)} style={{
                                        backgroundColor: `${selectedButton === index ? '#1976d2' : ''}`,
                                        color: `${selectedButton === index ? 'white' : ''}`,
                                    }}>{table.numberTable}</Item>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default TableDialog
