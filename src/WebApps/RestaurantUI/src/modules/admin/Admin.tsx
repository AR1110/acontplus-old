import { PrivateRoutes } from "@/core/models";
import { RoutesWithNotFound } from "@/core/utils";
import { Route } from "react-router-dom";
import { lazy } from "react";
import IngredientPage from "./pages/ingredient/IngredientePage";

const AdminLayout = lazy(() => import("@/layouts/AdminLayout"));

const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const TableIndex = lazy(() => import("./pages/table/TablePage")); 
const CategoryPage = lazy(() => import("./pages/category/CategoryPage"));
const ProductPage = lazy(() => import("./pages/product/ProductPage"));
const DishPage = lazy(() => import("./pages/dish/Dish"));
const ProductionAreaPage = lazy(() => import("./pages/production-area/ProductioArea"));

/**
 *
 * Panel Administrativo
 */
export default function Admin() {
  return (
    <RoutesWithNotFound>
      <Route path="/" element={<AdminLayout />}>
        <Route
          path={PrivateRoutes.DASHBOARD}
          element={<DashboardPage />}
        ></Route>
        <Route path={PrivateRoutes.TABLE} element={<TableIndex />}></Route>
        <Route path={PrivateRoutes.CATEGORY} element={<CategoryPage />}></Route>
        <Route path={PrivateRoutes.PRODUCT} element={<ProductPage />}></Route>
        <Route path={PrivateRoutes.INGREDIENT} element={<IngredientPage />}></Route>
        <Route path={PrivateRoutes.DISH} element={<DishPage />}></Route>
        <Route path={PrivateRoutes.PRODUCTION_AREA} element={<ProductionAreaPage /> }></Route>
      </Route>
    </RoutesWithNotFound>
  );
}
