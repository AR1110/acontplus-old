import { PrivateRoutes } from "@/core/models";
import { RoutesWithNotFound } from "@/core/utils";
import { Route } from "react-router-dom";
import { lazy } from "react";

const AdminLayout = lazy(() => import("@/layouts/AdminLayout"));

const Dashboard = lazy(() => import("./dashboard/Dashboard"));
const TableComponent = lazy(() => import("./table/Table"));
const DishComponent = lazy(() => import("./dish/Dish"));

/**
 *
 * Panel Administrativo
 */
export default function Admin() {
  return (
    <RoutesWithNotFound>
      <Route path="/" element={<AdminLayout />}>
        <Route path={PrivateRoutes.DASHBOARD} element={<Dashboard />}></Route>
        <Route path={PrivateRoutes.TABLE} element={<TableComponent />}></Route>
        <Route path={PrivateRoutes.DISH} element={<DishComponent />}></Route>
      </Route>
    </RoutesWithNotFound>
  );
}
