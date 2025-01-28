import { Routes } from '@angular/router';
import { GeneralConfigComponent } from './pages/general-config/general-config.component';
import { DocConfigPageComponent } from './pages/doc-config/doc-config.component';
import { UserCustomerPageComponent } from './pages/user-customer-page/user-customer-page.component';
import { UserCustomerRequestPageComponent } from './pages/user-customer-request-page/user-customer-request-page.component';
import { UserProfilePageComponent } from './pages/user-profile-page/user-profile-page.component';
import { EstablishmentPageComponent } from './pages/establishment-page/establishment-page.component';
import { CompanyPageComponent } from '@modules/config/pages/company-page/company-page.component';
import { PrinterComponent } from '@modules/config/ui/printer/printer.component';
import { WizardConfigComponent } from '@modules/config/pages/wizard-config/wizard-config.component';
import { TiempoCreditoPageComponent } from './pages/tiempo-credito-page/tiempo-credito-page.component';

export const routes: Routes = [
  {
    path: 'general-config-page',
    title: 'Config. General',
    component: GeneralConfigComponent,
    data: {
      breadcrumb: 'Config. General',
    },
  },
  {
    path: 'doc-config-page',
    title: 'Config. Docs',
    component: DocConfigPageComponent,
    data: {
      breadcrumb: 'Config. Docs',
    },
  },
  {
    path: 'user-customer-page',
    title: 'Usuario',
    component: UserCustomerPageComponent,
    data: {
      breadcrumb: 'Usuario',
    },
  },
  {
    path: 'user-customer-request-page',
    title: 'Solicitudes de Usuario',
    component: UserCustomerRequestPageComponent,
    data: {
      breadcrumb: 'Solicitudes de Usuario',
    },
  },
  {
    path: 'user-profile-page',
    title: 'Configuración de Perfil',
    component: UserProfilePageComponent,
    data: {
      breadcrumb: 'Configuración de Perfil',
    },
  },
  {
    path: 'establishment',
    title: 'Establecimiento',
    component: EstablishmentPageComponent,
    data: {
      breadcrumb: 'Establecimiento',
    },
  },
  {
    path: 'company',
    title: 'Entidad',
    component: CompanyPageComponent,
    data: {
      breadcrumb: 'Entidad',
    },
  },
  {
    path: 'printer',
    title: 'Configuración Impresora',
    component: PrinterComponent,
    data: {
      breadcrumb: 'Configuración Impresora',
    },
  },
  {
    path: 'wizard-config',
    title: 'Configuración Inicial',
    component: WizardConfigComponent,
    data: {
      breadcrumb: 'Configuración Inicial',
    },
  },
  {
    path: 'tiempo-credito',
    title: 'Tiempo de Crédito',
    component: TiempoCreditoPageComponent,
    data: {
      breadcrumb: 'Tiempo de Crédito',
    },
  },
];
