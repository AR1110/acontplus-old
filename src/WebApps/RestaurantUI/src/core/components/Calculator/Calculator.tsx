import { Box, Grid, useTheme } from '@mui/material'; 
import CalculatorButton from './CalculatorButton';
import { addSound, clearSound } from '@/core/utilities';
import { BackspaceIcon } from '../IconsMaterial';
 
const grids = [7, 8, 9, 4, 5, 6, 1, 2, 3, ".", 0]

interface CalculatorProps {
    clearButton(): void
    onClickButton(value: number | string): void
    onClickOptionValue(value: number): void
}

export default function Calculator({ clearButton, onClickButton, onClickOptionValue }: CalculatorProps) {
    const theme = useTheme();
    const onClickCalculatorButton = (value: number | string) => {
        addSound();
        onClickButton(value)
    }

    const onClickClearButton = () => {
        clearButton();
        clearSound();
    }
    const onClickOption = (value: number) => {
        onClickOptionValue(value)
        addSound();
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 12, sm: 12, md: 12 }}>
                <Grid item xs={4} sm={4} md={4} >
                    <CalculatorButton onClick={() => onClickOption(5)}>$5</CalculatorButton>
                </Grid>
                <Grid item xs={4} sm={4} md={4} >
                    <CalculatorButton onClick={() => onClickOption(10)}>$10</CalculatorButton>
                </Grid>
                <Grid item xs={4} sm={4} md={4} >
                    <CalculatorButton onClick={() => onClickOption(20)}>$20</CalculatorButton>
                </Grid>
                {
                    grids.map((value, index) => (
                        <Grid item xs={4} sm={4} md={4} key={index}>
                            <CalculatorButton onClick={() => onClickCalculatorButton(value)}>{value}</CalculatorButton>
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
