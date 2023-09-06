import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Button,
  DialogActions,
  useTheme,
  useMediaQuery,
  Alert,
  AlertTitle,
} from "@mui/material";
import { OrdenService } from "@/core/services";
import { useRef, useState } from "react";
import { useLoaderStore, useOrderStore } from "@/stores";
import { itemToApi, summaryToApi } from "@/core/adapters";
import { SnackbarUtility } from "@/core/utilities";
import { CustomerReadDto } from "@/core/models";
import OrderSearch from "./OrderSearch";
import CustomerDialog from "../../Sale/Customer/CustomerDialog";

export interface OrderDialogWhatsApp {
  open: boolean;
  handleClose(): void;
}

const OrderConvertDoc = ({
  open,
  handleClose,
}: OrderDialogWhatsApp) => {
  const theme = useTheme();
  const getOrders = useOrderStore(state=>state.getOrders);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const showLoader = useLoaderStore((state) => state.showLoader);
  const [openCustomerDialog, setCustomerDialog] = useState(false);
  const [customers, setCustomers] = useState<CustomerReadDto>();

  const setOrderId = useRef(0);
  const customerId = useRef(0);
  const customerName = useRef("");

  const handleGetDetail = (codDoc: string) => {
    showLoader(true);
    OrdenService.get({ id: setOrderId.current, tipo: 2 })
      .then(async (response) => {
        const summaryResult = summaryToApi(response.order[0]);
        const itemsResult = itemToApi(response.orderItems);

        summaryResult["orderId"] = response.order[0].id;
        summaryResult["bodegaId"] = response.orderItems[0].bodegaId;
        summaryResult["customerCompanyId"] = customerId.current || 0;

        const data = {
          ...summaryResult,
          updateOrder: false,
          saveDoc: true,
          codDoc,
          quickSale: true,
          items: itemsResult,
          taxes: {},
          payments: {},
        };
        await onConvertToDoc(setOrderId.current, data);
      })
      .finally(() => showLoader(false));
  };

  const onConvertToDoc = (orderId: number, data: object) => {
    OrdenService.put(orderId, data)
      .then((response) => {
        if (response.code === "0") {
          SnackbarUtility.warning(response.message);
        }
        if (response.code === "1") {
          getOrders();
          handleClose();
          SnackbarUtility.success(response.message);
          customerName.current = "";
        }
      })
      .finally(() => showLoader(false));
  };

  const setCustomerValue = (customerCompanyId: number) => {
    customerId.current = customerCompanyId;
  };

  const openDialogCustomerAdd = () => {
    setCustomerDialog(true);
  };

  const handleCloseCustomerDialog = (data?: CustomerReadDto) => {
    setCustomerDialog(false);
    if (data) {
      setCustomers(data);
      customerId.current = data.customerCompanyId ?? 0;
      customerName.current = data.fiscalName ?? '';
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>Documento</DialogTitle>
        <DialogContent>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 1, md: 1 }}
          >
            <Grid style={{ marginTop: 15 }} item xl={10} md={10} xs={12}>
              <OrderSearch setCustomerValue={setCustomerValue} />
            </Grid>
            <Grid style={{ marginTop: 15 }} item xl={2} md={2} xs={12}>
              <Button
                onClick={openDialogCustomerAdd}
                variant="outlined"
                size="large"
                style={{ height: 55 }}
              >
                Nuevo
              </Button>
            </Grid>

            <Grid style={{ marginTop: 15 }} item xl={12} md={12} xs={12}>
              {
              customerName.current.length > 0 &&
                <Alert severity="success">
                  <AlertTitle>Cliente</AlertTitle>
                  {customerName.current}
                </Alert>
              }
            </Grid>

            {/* { Button } */}
            <Grid item xl={6} xs={12} md={6}>
              <Button
                style={{ height: 75 }}
                fullWidth
                size="large"
                variant="contained"
                color="primary"
                onClick={() => handleGetDetail("FV")}
              >
                FACTURA DE VENTA
              </Button>
            </Grid>
            <Grid item xl={6} xs={12} md={6}>
              <Button
                style={{ height: 75 }}
                fullWidth
                size="large"
                variant="contained"
                color="success"
                onClick={() => handleGetDetail("NE")}
              >
                NOTA DE ENTREGA
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            variant="outlined"
            size="large"
            onClick={handleClose}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      {openCustomerDialog && (
        <CustomerDialog
          open={openCustomerDialog}
          handleClose={handleCloseCustomerDialog}
        />
      )}
    </>
  );
};

export default OrderConvertDoc;
