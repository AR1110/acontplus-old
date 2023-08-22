import { SaveIcon, TaskIcon } from "@/core/components";
import HtmlTooltip from "@/core/components/HtmlTooltip";
import { Button, Typography } from "@mui/material";
import { Fragment } from "react";


export default function PaymentAction() {
    return (
        <>
            <Button color="inherit" startIcon={<SaveIcon />}>Guardar</Button>
            <HtmlTooltip
                title={
                    <Fragment>
                        <Typography variant="caption" display="block" gutterBottom>
                            {"Ya no será posible modificar la venta - para hacer cambios, tendrás que cancelar esta y crear una nueva."}
                        </Typography>
                    </Fragment>
                }
            >
                <Button color="inherit" startIcon={<TaskIcon />}>Facturar</Button>
            </HtmlTooltip>
        </>
    )
}
