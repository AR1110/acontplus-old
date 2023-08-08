import { PrivateRoutes } from "@/core/models";
import { RoutesWithNotFound } from "@/core/utilities";
import { Navigate, Route } from "react-router-dom";
import { lazy } from "react";

const MainLayout = lazy(() => import("@/layouts/MainLayout"));
const Pos = lazy(() => import("./Pos/Pos"));
// const TablePage = lazy(() => import("./pages/table/TablePage")); 
// const CategoryPage = lazy(() => import("./pages/category/CategoryPage"));
// const ProductPage = lazy(() => import("./pages/product/ProductPage"));
// const DishPage = lazy(() => import("./pages/dish/Dish"));
// const ProductionAreaPage = lazy(() => import("./pages/production-area/ProductioArea"));
// const IngredientPage = lazy(() => import("./pages/ingredient/IngredientePage"));
// const ItemPage = lazy(() => import("./pages/item/ItemPage"))
/**
 *
 * Panel Administrativo
 */
export default function Private() {
    return (
        <RoutesWithNotFound>
            <Route path="/" element={<MainLayout />}>
                {/* <Route path="/" element={<Navigate to={PrivateRoutes.DASHBOARD} />} />
                <Route path={PrivateRoutes.DASHBOARD} element={<Dashboard />} /> */}
                <Route path="/" element={<Navigate to={PrivateRoutes.POS} />} />
                <Route path={PrivateRoutes.POS} element={<Pos />} />
            </Route>
        </RoutesWithNotFound>
    );
}
