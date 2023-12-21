import { Routes } from "@angular/router";
import { TechnicalSupportPageComponent } from "./pages/technical-support-page/technical-support-page.component";
import { LayoutComponent } from "@modules/home/layout";
export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'technical-support',
        component: TechnicalSupportPageComponent,
        data: {
          breadcrumb: 'Dashboard',
          buttonAction: 'Nuevo'
        }
      },
    ]
  },
]
