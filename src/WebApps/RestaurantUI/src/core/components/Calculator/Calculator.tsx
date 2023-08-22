import { Box, Grid } from '@mui/material';
import { BackspaceIcon } from '..';
import CalculatorButton from './CalculatorButton';
import { addSound, clearSound } from '@/core/utilities';



const grids = [7, 8, 9, 4, 5, 6, 1, 2, 3, ".", 0]

export default function Calculator() {
    const onClickButton = (value: number | string)=>{
        console.log(value)
        addSound();
    }
    const onClickClearButton = ()=>{ 
        clearSound()
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 12, sm: 12, md: 12 }}>
                {
                    grids.map((value, index) => (
                        <Grid item xs={4} sm={4} md={4} key={index}>
                            <CalculatorButton onClick={()=>onClickButton(value)}>{value}</CalculatorButton>
                        </Grid>
                    ))
                }
                {/* <Grid item xs={4} sm={4} md={4}>
                    <Item>8</Item>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                    <Item>9</Item>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                    <Item>4</Item>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                    <Item>5</Item>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                    <Item>6</Item>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                    <Item>1</Item>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                    <Item>2</Item>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                    <Item>3</Item>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                    <Item>.</Item>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                    <Item>0</Item>
                </Grid> */}
                <Grid item xs={4} sm={4} md={4}>
                    <CalculatorButton onClick={onClickClearButton}>
                        <BackspaceIcon />
                    </CalculatorButton>
                </Grid>

            </Grid>
        </Box>
    )
}
