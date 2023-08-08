import { CategoryIcon } from "@/core/components";
import { ErrorBoundary } from "@/core/utilities";
import { Box, Button, Grid, Paper, Stack, Tab, Tabs, Typography, tabsClasses } from "@mui/material";
import { useState } from "react";

export default function Pos() {

    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <ErrorBoundary fallBackComponent={<>Error!</>}>
            {/* <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }} elevation={0}>

                </Paper>                
            </Grid>  */}
            <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}
                    elevation={0}>
                    <Grid container>
                        <Grid item xs={8}>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    maxWidth: { xs: 'auto', sm: 'auto' },
                                    bgcolor: 'background.paper',
                                }}
                            >
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    variant="scrollable"
                                    scrollButtons
                                    aria-label="visible arrows tabs example"
                                    sx={{
                                        [`& .${tabsClasses.scrollButtons}`]: {
                                            '&.Mui-disabled': { opacity: 0.3 },
                                        },
                                    }}
                                >
                                    <Tab label="Item One" />
                                    <Tab label="Item Two" />
                                    <Tab label="Item Three" />
                                    <Tab label="Item Four" />
                                    <Tab label="Item Five" />
                                    <Tab label="Item Six" />
                                    <Tab label="Item Seven" />
                                </Tabs>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            {/* Contenido de la columna con ancho de 4 */}
                        </Grid>
                    </Grid>



                </Paper>
            </Grid>
        </ErrorBoundary>
    );
}
