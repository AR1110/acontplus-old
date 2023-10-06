
import { Paper } from "@mui/material";
import OrderTable from "./OrderTable";
import { OrderProvider } from "./context";
import OrderFilter from "./Components/OrderFilter";


export default function Order() {
    return (
        <OrderProvider>
            <Paper sx={{ maxWidth: "auto", margin: 'auto', overflow: 'hidden' }}>
                <OrderFilter />
                <OrderTable />
            </Paper>
        </OrderProvider>
    )
}
