import BackdropLoader from "@/core/components/BackdropLoader";
import { ErrorBoundary } from "@/core/utils";
import { useFetchAndLoad } from "@/hooks";
import { Button, Grid, Stack, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { DialogCustom, dialogOpenSubject$ } from '@/core/components';
import IngredientDialog from "./components/IngredientDialog";


export default function IngredientPage() {
    const { loading, callEndpoint } = useFetchAndLoad();
    const onOpenDialog = () => {

        dialogOpenSubject$.setSubject = true;
    };

    const callBackCloseDialog = () => {
        //setReloadFetchApi(!reloadFetchApi)
    }

    return (
        <ErrorBoundary fallBackComponent={<>Error</>}>
            {loading ? <BackdropLoader open={loading} /> : <Grid item xs={12}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={1}
                >
                    <Typography variant="h5" gutterBottom>
                        Ingredientes
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={onOpenDialog}
                    >
                        Agregar
                    </Button>
                </Stack>

            </Grid>
            }
            <DialogCustom maxWidth='sm' children={<IngredientDialog callBackCloseDialog={callBackCloseDialog} />} />
        </ErrorBoundary>
    );
}
