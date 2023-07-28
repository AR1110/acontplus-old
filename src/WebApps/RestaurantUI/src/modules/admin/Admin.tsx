import { PrivateRoutes } from "@/core/models";
import { RoutesWithNotFound } from "@/core/utils";
import { Route } from "react-router-dom";
import { lazy } from "react";

const AdminLayout = lazy(() => import("@/layouts/AdminLayout"));

const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const TableIndex = lazy(() => import("./pages/table/Table"));
const DishComponent = lazy(() => import("./pages/dish/Dish"));
const CategoryPage = lazy(() => import("./pages/category/CategoryPage"));
const ProductPage = lazy(() => import("./pages/product/ProductPage"));

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
        <Route path={PrivateRoutes.DISH} element={<DishComponent />}></Route>
        <Route path={PrivateRoutes.CATEGORY} element={<CategoryPage />}></Route>
        <Route path={PrivateRoutes.PRODUCT} element={<ProductPage />}></Route>
      </Route>
    </RoutesWithNotFound>
  );
}
