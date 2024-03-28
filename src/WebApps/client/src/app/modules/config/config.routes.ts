import { Routes } from "@angular/router";
import { GeneralConfigComponent } from "./pages/general-config/general-config.component";
import { DocConfigPageComponent } from "./pages/doc-config/doc-config.component";
export const routes: Routes = [
  {
    path: 'general-config-page',
    title: 'Config. General',
    component: GeneralConfigComponent,
    data: {
      breadcrumb: 'Config. General'
    }
  },
  {
    path: 'doc-config-page',
    title: 'Config. Docs',
    component: DocConfigPageComponent,
    data: {
      breadcrumb: 'Config. Docs'
    }
  }
]
