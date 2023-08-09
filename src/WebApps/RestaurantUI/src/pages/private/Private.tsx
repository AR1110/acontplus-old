import { PrivateRoutes } from "@/core/models";
import { RoutesWithNotFound } from "@/core/utilities";
import { Navigate, Route } from "react-router-dom";
import { lazy } from "react";

const MainLayout = lazy(() => import("@/layouts/MainLayout"));
const Pos = lazy(() => import("./Pos/Pos")); 

export default function Private() {
    return (
        <RoutesWithNotFound>
            <Route path="/" element={<MainLayout />}> 
                <Route path="/" element={<Navigate to={PrivateRoutes.POS} />} />
                <Route path={PrivateRoutes.POS} element={<Pos />} />
            </Route>
        </RoutesWithNotFound>
    );
}
