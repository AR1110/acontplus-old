import { PrivateRoutes } from "@/core/models";
import { ErrorBoundary, RoutesWithNotFound } from "@/core/utilities";
import { Navigate, Route } from "react-router-dom";
import { lazy } from "react";

const MainLayout = lazy(() => import("@/layouts/MainLayout"));
const Sale = lazy(() => import("./Sale/Sale")); 
const Order = lazy(() => import("./Order/Order")); 

export default function Private() {
    return (
        <ErrorBoundary fallBackComponent={<>Error!</>}>
        <RoutesWithNotFound>
            <Route path="/" element={<MainLayout />}> 
                <Route path="/" element={<Navigate to={PrivateRoutes.SALE} />} />
                <Route path={PrivateRoutes.SALE} element={<Sale />} />
                <Route path={PrivateRoutes.ORDER} element={<Order />} />
            </Route>
        </RoutesWithNotFound>
        </ErrorBoundary>
    );
}
