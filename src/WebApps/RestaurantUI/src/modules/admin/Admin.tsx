import { PrivateRoutes } from "@/core/models";
import { RoutesWithNotFound } from "@/core/utils";
import { Navigate, Route } from "react-router-dom";
import { lazy } from "react";
import RootLayout from "@/layouts/RootLayout";

const Dashboard = lazy(() => import("./dashboard/Dashboard"));
const Table = lazy(() => import("./table/Table"));

/**
 *
 * Panel Administrativo
 */
export default function Admin() {
  return (
    <>
      <RoutesWithNotFound>
        <Route path="/" element={<RootLayout />}>
          <Route path={PrivateRoutes.DASHBOARD} element={<Dashboard />}></Route>
          <Route path={PrivateRoutes.TABLE} element={<Table />}></Route>
        </Route>
      </RoutesWithNotFound>
    </>
  );
}
