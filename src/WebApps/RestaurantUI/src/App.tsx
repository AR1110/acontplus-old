import { Route, BrowserRouter, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react"; 
import { RoutesWithNotFound, SnackbarUtilitiesConfigurator } from "@/core/utilities/index.ts";
import { PrivateRoutes, PublicRoutes } from "./core/models";
import { AuthGuard } from "./core/guards";
import { SnackbarProvider } from "notistack";
import BackdropLoader from "./core/components/BackdropLoader";
import { useLoaderStore } from "./stores";

const Login = lazy(() => import("@/pages/login/Login"));
const Private = lazy(() => import("@/pages/private/Private"));

export default function App() {
  const {loading}  = useLoaderStore();
  return (
    <Suspense fallback={<>Cargando</>}>
      <SnackbarProvider>
        <SnackbarUtilitiesConfigurator />
        <BrowserRouter>
          <RoutesWithNotFound>
            <Route path="/" element={<Navigate to={PrivateRoutes.PRIVATE}></Navigate>}></Route>
            <Route path={PublicRoutes.LOGIN} element={<Login />}></Route>
            <Route element={<AuthGuard privateValidation/>}>
              <Route
                path={`${PrivateRoutes.PRIVATE}/*`}
                element={<Private />}
              ></Route>
            </Route>
          </RoutesWithNotFound>
        </BrowserRouter>
        <BackdropLoader open={loading}/>
      </SnackbarProvider>
    </Suspense>
  );
}
