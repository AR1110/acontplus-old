import { Routes } from "@angular/router"; 
import {ReportsPageComponent} from "./pages/reports-page/reports-page.component";
import {TestComponent} from "./pages/test/test.component";
export const routes: Routes = [
     {
        path: 'reports-page',
        title: 'Reporte Compras',
        component: ReportsPageComponent,
        data: {
            breadcrumb: 'Reporte Compras'
        }
    },
    {
        path: 'test', 
        title: 'Reporte Compras',
        component: TestComponent,
        data: {
            breadcrumb: 'Reporte Compras'
        }
    },
]
