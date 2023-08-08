import { Route, BrowserRouter, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react"; 
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { RoutesWithNotFound, SnackbarUtilitiesConfigurator } from "@/core/utilities/index.ts"; 
import { PrivateRoutes, PublicRoutes } from "./core/models";
import { AuthGuard } from "./core/guards";
import { SnackbarProvider } from "notistack";

const Login = lazy(() => import("@/pages/login/LoginPage"));
const Private = lazy(() => import("@/pages/private/Private")); 

export default function App() {
  return (
    <Suspense fallback={<>Cargando</>}>
      <Provider store={store}>
        <SnackbarProvider>
        <SnackbarUtilitiesConfigurator />
        <BrowserRouter>
          <RoutesWithNotFound>
            <Route path="/" element={<Navigate to={PrivateRoutes.PRIVATE}></Navigate>}></Route>
            <Route path={PublicRoutes.LOGIN} element={<Login />}></Route>
            <Route element={<AuthGuard privateValidation={true} />}>
              <Route
                path={`${PrivateRoutes.PRIVATE}/*`}
                element={<Private />}
              ></Route> 
            </Route>
          </RoutesWithNotFound>
        </BrowserRouter>
        </SnackbarProvider>
      </Provider>
    </Suspense>
  );
}
