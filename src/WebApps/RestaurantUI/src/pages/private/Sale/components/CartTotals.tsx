import { DeleteIcon } from '@/core/components'
import { Avatar, Box, Divider, FormControlLabel, FormGroup, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import React from 'react'

const listItemCustom = {
    paddingTop: '3px',
    paddingBottom: '3px'
}

export default function CartTotals() {
    const items = [
        { description: 'Item 1', quantity: 2, price: 10 },
        { description: 'Item 2', quantity: 3, price: 15 },
        // Add more items
    ];

    const subtotals = {
        subtotal: items.reduce((sum, item) => sum + item.quantity * item.price, 0),
        tax: 0.1, // Example tax rate of 10%
    };

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
                    <Typography variant="subtitle2">${subtotals.subtotal.toFixed(2)}</Typography>

                </ListItem>
                <ListItem sx={listItemCustom}>
                    <ListItemText>
                        <Typography variant="subtitle2" gutterBottom>
                            IVA (12%)
                        </Typography>
                    </ListItemText>
                    <Typography variant="subtitle2">${(subtotals.subtotal * subtotals.tax).toFixed(2)}</Typography>
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText>
                    <Typography variant="h6" gutterBottom>
                            Total
                        </Typography>
                    </ListItemText>
                    <Typography color="error" variant="h6" gutterBottom>${(subtotals.subtotal * (1 + subtotals.tax)).toFixed(2)}</Typography>
                </ListItem>
            </List>
        </div>
    );
}
