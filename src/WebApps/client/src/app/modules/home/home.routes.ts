import { Routes } from "@angular/router";
import { LayoutComponent } from "./layout";
import { DashboardComponent } from "./dashboard";
export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        title: 'Dashboard',
        component: DashboardComponent,
        data: {
          breadcrumb: 'Dashboard'
        }
      },
    ]
  }
]
