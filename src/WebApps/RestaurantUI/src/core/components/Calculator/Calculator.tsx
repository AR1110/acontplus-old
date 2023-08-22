import { Box, Grid } from '@mui/material';
import { BackspaceIcon } from '..';
import CalculatorButton from './CalculatorButton';
import { addSound, clearSound } from '@/core/utilities';



const grids = [7, 8, 9, 4, 5, 6, 1, 2, 3, ".", 0]

export default function Calculator() {
    const onClickButton = (value: number | string) => {
        console.log(value)
        addSound();
    }
    const onClickClearButton = () => {
        clearSound()
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 12, sm: 12, md: 12 }}>
                <Grid item xs={4} sm={4} md={4} >
                    <CalculatorButton >$5</CalculatorButton>
                </Grid>
                <Grid item xs={4} sm={4} md={4} >
                    <CalculatorButton  >$10</CalculatorButton>
                </Grid>
                <Grid item xs={4} sm={4} md={4} >
                    <CalculatorButton  >$20</CalculatorButton>
                </Grid>
             

                {
                    grids.map((value, index) => (
                        <Grid item xs={4} sm={4} md={4} key={index}>
                            <CalculatorButton onClick={() => onClickButton(value)}>{value}</CalculatorButton>
                        </Grid>
                    ))
                } 
                <Grid item xs={4} sm={4} md={4}>
                    <CalculatorButton onClick={onClickClearButton}>
                        <BackspaceIcon />
                    </CalculatorButton>
                </Grid>

            </Grid>
        </Box>
    )
}
