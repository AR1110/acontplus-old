import { Paper, styled } from "@mui/material";

const CalculatorButton = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.h4,
    cursor: "pointer",
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    transition: 'background-color 0.3s ease-in-out',
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? '#35414A' : '#f5f5f5',
    },
    '@media (max-width: 768px)': {
        fontSize: '1rem', // Cambiar el tamaño de fuente para pantallas más pequeñas
        textAlign: "center"
      },
}));

export default CalculatorButton