import { Routes } from "@angular/router"; 
import { DashboardComponent } from "./dashboard";
export const routes: Routes = [ 
  {
        path: '',
        title: 'Dashboard',
        component: DashboardComponent,
        data: {
          breadcrumb: 'Dashboard'
        } 
      }
]
