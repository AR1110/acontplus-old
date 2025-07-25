import { SolicitudAutorizacionComponent } from '@modules/config/ui/solicitud-autorizacion/solicitud-autorizacion.component';
import { ElectronicSignatureComponent } from '@modules/config/ui/electronic-signature/electronic-signature.component';
import { TiempoCreditoPageComponent } from '@modules/config/ui/tiempo-credito-page/tiempo-credito-page.component';
import { EstablishmentPageComponent } from '@modules/config/ui/establishment-page/establishment-page.component';
import { UserProfilePageComponent } from '@modules/config/ui/user-profile-page/user-profile-page.component';
import { SetupDashboardComponent } from '@modules/config/ui/setup-dashboard/setup-dashboard.component';
import { GeneralConfigComponent } from '@modules/config/ui/general-config/general-config.component';
import { WizardConfigComponent } from '@modules/config/ui/wizard-config/wizard-config.component';
import { UserCustomerComponent } from '@modules/config/ui/user-customer/user-customer.component';
import { ExcelImportComponent } from '@modules/config/ui/excel-import/excel-import.component';
import { DocConfigPageComponent } from '@modules/config/ui/doc-config/doc-config.component';
import { CreditTimeComponent } from '@modules/config/ui/credit-time/credit-time.component';
import { PrinterComponent } from '@modules/config/ui/printer/printer.component';
import { CompanyComponent } from '@modules/config/ui/company/company.component';
import { ConfigHomeComponent } from './ui/config-home.component';
import { setupGuard } from '@modules/config/guards/setup.guard';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component: ConfigHomeComponent,
    data: { breadcrumb: 'Configuración' },
  },
  {
    path: 'general-config',
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
    canActivate: [setupGuard],
    data: {
      breadcrumb: 'Config. Docs',
    },
  },
  {
    path: 'user-customer',
    title: 'Usuario',
    component: UserCustomerComponent,
    data: {
      breadcrumb: 'Usuario',
    },
  },
  {
    path: 'solicitud-autorizacion',
    title: 'Solicitudes de Usuario',
    component: SolicitudAutorizacionComponent,
    data: {
      breadcrumb: 'Solicitudes de Usuario',
    },
  },
  {
    path: 'user-profile-page',
    title: 'Configuración de Perfil',
    component: UserProfilePageComponent,
    canActivate: [setupGuard],
    data: {
      breadcrumb: 'Configuración de Perfil',
    },
  },
  {
    path: 'establishment',
    title: 'Establecimiento',
    component: EstablishmentPageComponent,
    canActivate: [setupGuard],
    data: {
      breadcrumb: 'Establecimiento',
    },
  },
  {
    path: 'company',
    title: 'Entidad',
    component: CompanyComponent,
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
    component: SetupDashboardComponent,
    canActivate: [setupGuard],
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
  {
    path: 'excel-import',
    title: 'Importación',
    component: ExcelImportComponent,
    data: {
      breadcrumb: 'Importación',
    },
  },
  {
    path: 'electronic-signature',
    component: ElectronicSignatureComponent,
    canActivate: [setupGuard],
    data: {
      breadcrumb: 'Firma Eletrónica',
    },
  },
  {
    path: 'credit-time',
    component: CreditTimeComponent,
    data: {
      breadcrumb: 'Tiempo Crédito',
    },
  },
];
