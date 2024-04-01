import { Routes } from "@angular/router";
import { GeneralConfigComponent } from "./pages/general-config/general-config.component";
import { DocConfigPageComponent } from "./pages/doc-config/doc-config.component";
import { UserCustomerPageComponent } from "./pages/user-customer-page/user-customer-page.component";
import { UserCustomerRequestPageComponent } from "./pages/user-customer-request-page/user-customer-request-page.component";
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
  },
  {
    path: 'user-customer-page',
    title: 'Usuario',
    component: UserCustomerPageComponent,
    data: {
      breadcrumb: 'Usuario'
    }
  },
  {
    path: 'user-customer-request-page',
    title: 'Solicitudes de Usuario',
    component: UserCustomerRequestPageComponent,
    data: {
      breadcrumb: 'Solicitudes de Usuario'
    }
  }
]
