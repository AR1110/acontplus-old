import { Route, BrowserRouter, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Suspense, lazy } from "react";
import { RoutesWithNotFound, SnackbarUtilitiesConfigurator } from "@/core/utilities/index.ts";
import { PrivateRoutes, PublicRoutes } from "./core/models";
import { AuthGuard } from "./core/guards";
import { SnackbarProvider } from "notistack";
import BackdropLoader from "./core/components/BackdropLoader";
import { useLoaderStore } from "./stores";
import { useDarkMode } from "./context/DarkModeContext";

const Login = lazy(() => import("@/pages/login/Login"));
const Private = lazy(() => import("@/pages/private/Private"));

export default function App() {
  const { loading } = useLoaderStore();
  const { darkMode } = useDarkMode();

  const darkTheme = createTheme({
    palette: {
      mode: darkMode ? 'dark':'light',
    },

  });
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> 
      <Suspense fallback={<>Cargando</>}>
        <SnackbarProvider>
          <SnackbarUtilitiesConfigurator />
          <BrowserRouter basename="/Restaurant/">
           
            <RoutesWithNotFound>
              <Route path="/" element={<Navigate to={PrivateRoutes.PRIVATE}></Navigate>}></Route>
              <Route path={PublicRoutes.LOGIN} element={<Login />}></Route>
              <Route element={<AuthGuard privateValidation />}>
                <Route
                  path={`${PrivateRoutes.PRIVATE}/*`}
                  element={<Private />}
                ></Route>
              </Route>
            </RoutesWithNotFound>
          </BrowserRouter>
          <BackdropLoader open={loading} />
        </SnackbarProvider>
      </Suspense>
    </ThemeProvider>
  );
}
