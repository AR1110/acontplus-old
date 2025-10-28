import { SolicitudAutorizacionComponent } from '@modules/config/ui/solicitud-autorizacion/solicitud-autorizacion.component';
import { ElectronicSignatureComponent } from '@modules/config/ui/electronic-signature/electronic-signature.component';
import { EstablishmentPage } from '@modules/config/ui/establishment-page/establishment-page';
import { UserProfilePageComponent } from '@modules/config/ui/user-profile-page/user-profile-page.component';
import { GeneralConfigComponent } from '@modules/config/ui/general-config/general-config.component';
import { WizardConfigComponent } from '@modules/config/ui/wizard-config/wizard-config.component';
import { UserCustomerComponent } from '@modules/config/ui/user-customer/user-customer.component';
import { ExcelImportComponent } from '@modules/config/ui/excel-import/excel-import.component';
import { DocConfigPageComponent } from '@modules/config/ui/doc-config/doc-config.component';
import { CreditTimeComponent } from '@modules/config/ui/credit-time/credit-time.component';
import { PrinterComponent } from '@modules/config/ui/printer/printer.component';
import { CompanyComponent } from '@modules/config/ui/company/company.component';
import { ConfigHomeComponent } from './ui/config-home.component';
import { ShiftComponent } from './ui/shift/shift.component';
import { Routes } from '@angular/router';
import { WarehouseComponent } from '@inventory/ui/warehouse/warehouse.component';
import {ProfileSettings} from "@modules/config/ui/profile/settings/settings";
import {ProfileLayout} from "@modules/config/ui/profile/layout/layout";

export const routes: Routes = [
  {
    path: 'profile',
    component: ProfileLayout,
    data: { breadcrumb: 'Perfil' },
    children: [
      { path: '', redirectTo: 'settings', pathMatch: 'full' },
      {
        path: 'settings',
        component: ProfileSettings,
        data: { breadcrumb: 'Configuración de Perfil' }
      },
      // { path: 'settings', component: ProfileSettings },
    ],
  },
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
    path: 'doc-config',
    title: 'Config. Docs',
    component: DocConfigPageComponent,
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
    path: 'user-request',
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
    data: {
      breadcrumb: 'Configuración de Perfil',
    },
  },
  {
    path: 'establishment',
    title: 'Establecimiento',
    component: EstablishmentPage,
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
    component: WizardConfigComponent,
    data: {
      breadcrumb: 'Configuración Inicial',
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
    data: {
      breadcrumb: 'Firma Electronica',
    },
  },
  {
    path: 'credit-time',
    component: CreditTimeComponent,
    data: {
      breadcrumb: 'Tiempo Crédito',
    },
  },
  {
    path: 'shift',
    component: ShiftComponent,
    data: {
      breadcrumb: 'Turno',
    },
  },
  {
    path: 'warehouse',
    component: WarehouseComponent,
    data: {
      breadcrumb: 'Bodega',
    },
  },
];
