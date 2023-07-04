import { Route, BrowserRouter, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { RoutesWithNotFound, SnackbarUtilsConfigurator } from "@/core/utils";
import { PrivateRoutes, PublicRoutes } from "@/core/models/";
import AuthGuard from "@/core/guards/auth.guard.tsx";
import RecipeComponent from "./pages/Recipe/RecipeComponent.tsx";

const Login = lazy(() => import("@/pages/Auth/components/Login"));
const Home = lazy(() => import("@/pages/Home/Home"));
const Pos = lazy(() => import("@/pages/Pos/Pos"));
const Categoria = lazy(() => import("@/pages/Categoria/Categoria"));

function App() {
  return (
    <Suspense fallback={<>Cargando</>}>
      <Provider store={store}>
        <SnackbarProvider>
          <SnackbarUtilsConfigurator />
          {/* <RouterProvider router={router} />; */}
          <BrowserRouter>
            <RoutesWithNotFound>
              {/* Rutas Publicas */}
              <Route path="/" element={<Navigate to={PrivateRoutes.POS} />} />
              <Route path={PublicRoutes.LOGIN} element={<Login />} />

              {/* Rutas privadas */}
              <Route element={<AuthGuard />}>
                <Route path={PrivateRoutes.HOME} element={<Home />}></Route>
                <Route path={PrivateRoutes.POS} element={<Pos />}></Route>
                <Route path={PrivateRoutes.RECIPE} element={<RecipeComponent />}></Route>
                <Route
                  path={PrivateRoutes.CATEGORIA}
                  element={<Categoria />}
                ></Route>
              </Route>
            </RoutesWithNotFound>
          </BrowserRouter>
        </SnackbarProvider>
      </Provider>
    </Suspense>
  );
}
export default App;
