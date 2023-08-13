 
import { saleStore } from '@/stores/saleStore'
import { Divider, List, ListItem, ListItemText, Typography } from '@mui/material';
const listItemCustom = {
    paddingTop: '3px',
    paddingBottom: '3px'
}

export default function CartTotals() {
    const summary = saleStore(state=>state.summary); 
    return (
        <div>

            <List>
                <Divider />
                <ListItem sx={listItemCustom}>
                    <ListItemText>
                        <Typography variant="subtitle2" gutterBottom>
                            SubTotal
                        </Typography>
                    </ListItemText>
                    <Typography variant="subtitle2">${summary.total.toFixed(2)}</Typography>

                </ListItem>
                <ListItem sx={listItemCustom}>
                    <ListItemText>
                        <Typography variant="subtitle2" gutterBottom>
                            IVA (12%)
                        </Typography>
                    </ListItemText>
                    <Typography variant="subtitle2">${summary.taxAmount.toFixed(2)}</Typography>
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText>
                    <Typography variant="h6" gutterBottom>
                            Total
                        </Typography>
                    </ListItemText>
                    <Typography color="error" variant="h6" gutterBottom>${summary.netTotal.toFixed(2)}</Typography>
                </ListItem>
            </List>
        </div>
    );
}
