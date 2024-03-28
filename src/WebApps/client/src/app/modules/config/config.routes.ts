import { Routes } from "@angular/router";
import { GeneralConfigComponent } from "./pages/general-config/general-config.component";
export const routes: Routes = [
  {
    path: 'general-config-page',
    title: 'Config. General',
    component: GeneralConfigComponent,
    data: {
      breadcrumb: 'Config. General'
    }
  }
]
