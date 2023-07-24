import { PrivateRoutes } from "@/core/models";
import { RoutesWithNotFound } from "@/core/utils";
import { Route } from "react-router-dom";
import { lazy } from "react";

const AdminLayout = lazy(() => import("@/layouts/AdminLayout"));

const Dashboard = lazy(() => import("./dashboard/Dashboard"));
const TableIndex = lazy(() => import("./pages/table/Table"));
const DishComponent = lazy(() => import("./dish/Dish"));
const Category = lazy(() => import("./pages/category/CategoryPage"));
const Product = lazy(() => import("./pages/product/ProductPage"));

/**
 *
 * Panel Administrativo
 */
export default function Admin() {
  return (
    <RoutesWithNotFound>
      <Route path="/" element={<AdminLayout />}>
        <Route path={PrivateRoutes.DASHBOARD} element={<Dashboard />}></Route>
        <Route path={PrivateRoutes.TABLE} element={<TableIndex />}></Route>
        <Route path={PrivateRoutes.DISH} element={<DishComponent />}></Route>
        <Route path={PrivateRoutes.CATEGORY} element={<Category />}></Route>
        <Route path={PrivateRoutes.PRODUCT} element={<Product />}></Route>
      </Route>
    </RoutesWithNotFound>
  );
}
