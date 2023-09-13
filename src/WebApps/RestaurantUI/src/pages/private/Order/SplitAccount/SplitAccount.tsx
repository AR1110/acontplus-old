import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { CardActions, CardContent, Stack, Typography } from '@mui/material';
import OrderItemTable from './OrderItemTable/OrderItemTable';
import { useEffect } from 'react';
import { useAsync, useFetchAndLoad } from '@/hooks';
import { OrdenService } from '@/core/services';
import { orderReadForUpdateAdapter } from '@/core/adapters';
import LeftOrderItem from './LeftOrderItem/LeftOrderItem';
import RightOrderItem from './RightOrderItem/RightOrderItem';

function not(a: readonly number[], b: readonly number[]) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly number[], b: readonly number[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: readonly number[], b: readonly number[]) {
    return [...a, ...not(b, a)];
}

const SplitAccount = () => {
    const [checked, setChecked] = React.useState<readonly number[]>([]);
    const [left, setLeft] = React.useState<readonly number[]>([0, 1, 2, 3, 5, 10, 11, 22, 34, 12, 45, 23, 234]);
    const [right, setRight] = React.useState<readonly number[]>([]);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items: readonly number[]) =>
        intersection(checked, items).length;

    const handleToggleAll = (items: readonly number[]) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    //Get
    const { loading, callEndpoint } = useFetchAndLoad();
    const getItemsApi = async () => await callEndpoint(OrdenService.getId(3));

    const itemAdapter = async (response: any) => {         
        const data = await orderReadForUpdateAdapter(response);
        console.log(data)
        // setCollectionItems([])
        // const items = itemReadAdapter(response.items || []);
        
        // setCollectionItems(items)
    }
 

    //se ejecuta cada vez que cambian la categoria
    useAsync(getItemsApi, itemAdapter, () => {
        console.log('init')
    }, []);
     

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={5} md={5} lg={5}>
               <LeftOrderItem/>
            </Grid>
            <Grid item>
                <Stack spacing={1} justifyItems="center" justifyContent="flex-start">
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Stack>
            </Grid>
            <Grid item xs={12} sm={5} md={5} lg={5}>
                <RightOrderItem/>
            </Grid>
        </Grid>
    );
}

export default SplitAccount;