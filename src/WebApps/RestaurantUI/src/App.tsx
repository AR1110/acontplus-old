import { Route, BrowserRouter, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react"; 
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { RoutesWithNotFound, SnackbarUtilitiesConfigurator } from "@/core/utils"; 
import { PrivateRoutes, PublicRoutes } from "./core/models";
import { AuthGuard } from "./core/guards";
import { SnackbarProvider } from "notistack";

const Login = lazy(() => import("@/pages/auth/components/Login"));
const Admin = lazy(() => import("@/modules/admin/Admin"));
const Pos = lazy(() => import("@/modules/pos/Pos")); 

export default function App() {
  return (
    <Suspense fallback={<>Cargando</>}>
      <Provider store={store}>
        <SnackbarProvider>
        <SnackbarUtilitiesConfigurator />
        <BrowserRouter>
          <RoutesWithNotFound>
            <Route
              path="/"
              element={<Navigate to={PrivateRoutes.ADMIN}></Navigate>}
            ></Route>
            <Route path={PublicRoutes.LOGIN} element={<Login />}></Route>
            <Route element={<AuthGuard privateValidation={true} />}>
              <Route
                path={`${PrivateRoutes.ADMIN}/*`}
                element={<Admin />}
              ></Route>
              <Route path={`${PrivateRoutes.POS}/*`} element={<Pos />}></Route>
            </Route>
          </RoutesWithNotFound>
        </BrowserRouter>
        </SnackbarProvider>
      </Provider>
    </Suspense>
  );
}
