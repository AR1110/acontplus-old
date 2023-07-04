import { useSnackbar, ProviderContext, VariantType } from "notistack";

let useSnackbarRef: ProviderContext;

const SnackbarUtilsConfigurator = () => {
  useSnackbarRef = useSnackbar();
  return null;
};

const SnackbarUtils = {
  tS(msg: string, variant: VariantType = "default"): void {
    useSnackbarRef.enqueueSnackbar(msg, {
      variant,
    });
  },
  error(message: string) {
    this.tS(message, "error");
  },
  success(message: string) {
    this.tS(message, "success");
  },
  warning(message: string) {
    this.tS(message, "warning");
  },
  info(message: string) {
    this.tS(message, "info");
  },
};

export { SnackbarUtilsConfigurator, SnackbarUtils };
