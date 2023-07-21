import { PrivateRoutes } from "@/core/models";
import { RoutesWithNotFound } from "@/core/utils";
import { Route } from "react-router-dom";
import PosLayout from "@/layouts/PosLayout";
/**
 *
 * Panel Administrativo
 */
export default function Pos() {
  return (
    <>
      <RoutesWithNotFound>
        <Route path="/" element={<PosLayout />}>
          {/* <Route path={PrivateRoutes.DASHBOARD} element={<Dashboard />}></Route> */}
        </Route>
      </RoutesWithNotFound>
    </>
  );
}
