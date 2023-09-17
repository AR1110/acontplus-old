import { Accordion, AccordionDetails, AccordionProps, AccordionSummary, AccordionSummaryProps, Button, Card, CardActions, CardContent, Grid, Stack, TextField, Typography, styled } from '@mui/material'
import RightOrderItemTable from './RightOrderItemTable'
import { useSplitAccountContext } from '../../context';
import { ArrowForwardIosIcon, FileCopyRoundedIcon, SaveIcon } from '@/core/components/IconsMaterial';

const StyledAccordion = styled((props: AccordionProps) => (
    <Accordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:before': {
        display: 'none',
    },
}));

const StyledAccordionSummary = styled((props: AccordionSummaryProps) => (
    <AccordionSummary
        expandIcon={<ArrowForwardIosIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const RightOrderItem = () => {
    const { rightOrder } = useSplitAccountContext();


    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                                <Grid item xs>
                                    <Typography variant="h6" component="div">
                                        Cuenta Individual
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Typography variant="h6">
                                    Total: ${rightOrder.total}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <StyledAccordion sx={{ mb: 1 }}>
                        <StyledAccordionSummary aria-controls="panel-information" id="panel-information">
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                Datos
                            </Typography>
                        </StyledAccordionSummary>
                        <StyledAccordionDetails>
                            <TextField
                                id="observacion"
                                label="Observación"
                                fullWidth
                                multiline
                            />
                        </StyledAccordionDetails>
                    </StyledAccordion>
                    <RightOrderItemTable />
                </CardContent>
                <CardActions>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                color='success'
                                size='large'
                                startIcon={<FileCopyRoundedIcon />}
                            >
                                Factura
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                color='warning'
                                size='large'
                                startIcon={<FileCopyRoundedIcon />}
                            >
                                Nota Entrega
                            </Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </>
    )
}

export default RightOrderItem