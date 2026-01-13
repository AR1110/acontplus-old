import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'profile',
    loadComponent: () =>
      import('@modules/config/ui/profile/layout/layout').then((m) => m.ProfileLayout),
    data: { breadcrumb: 'Perfil' },
    children: [
      { path: '', redirectTo: 'settings', pathMatch: 'full' },
      {
        path: 'settings',
        loadComponent: () =>
          import('@modules/config/ui/profile/settings/settings').then((m) => m.ProfileSettings),
        data: { breadcrumb: 'Configuración de Perfil' },
      },
      // { path: 'settings', component: ProfileSettings },
    ],
  },
  {
    path: '',
    loadComponent: () => import('./ui/config-home.component').then((m) => m.ConfigHomeComponent),
    data: { breadcrumb: 'Configuración' },
  },
  {
    path: 'general-config',
    title: 'Config. General',
    loadComponent: () =>
      import('@modules/config/ui/general-config/general-config.component').then(
        (m) => m.GeneralConfigComponent,
      ),
    data: {
      breadcrumb: 'Config. General',
    },
  },
  {
    path: 'doc-config',
    title: 'Config. Docs',
    loadComponent: () =>
      import('@modules/config/ui/doc-config/doc-config-page').then(
        (m) => m.DocConfigPageComponent,
      ),
    data: {
      breadcrumb: 'Config. Docs',
    },
  },
  {
    path: 'user-customer',
    title: 'Usuario',
    loadComponent: () =>
      import('@modules/config/ui/user-customer/user-customer.component').then(
        (m) => m.UserCustomerComponent,
      ),
    data: {
      breadcrumb: 'Usuario',
    },
  },
  {
    path: 'user-request',
    title: 'Solicitudes de Usuario',
    loadComponent: () =>
      import('@modules/config/ui/solicitud-autorizacion/solicitud-autorizacion.component').then(
        (m) => m.SolicitudAutorizacionComponent,
      ),
    data: {
      breadcrumb: 'Solicitudes de Usuario',
    },
  },
  {
    path: 'user-profile-page',
    title: 'Configuración de Perfil',
    loadComponent: () =>
      import('@modules/config/ui/user-profile-page/user-profile-page.component').then(
        (m) => m.UserProfilePageComponent,
      ),
    data: {
      breadcrumb: 'Configuración de Perfil',
    },
  },
  {
    path: 'establishment',
    title: 'Establecimiento',
    loadComponent: () =>
      import('@modules/config/ui/establishment-page/establishment-page').then(
        (m) => m.EstablishmentPage,
      ),
    data: {
      breadcrumb: 'Establecimiento',
    },
  },
  {
    path: 'company',
    title: 'Entidad',
    loadComponent: () =>
      import('@modules/config/ui/company-page/company-page').then((m) => m.CompanyPage),
    data: {
      breadcrumb: 'Entidad',
    },
  },
  {
    path: 'printer',
    title: 'Configuración Impresora',
    loadComponent: () =>
      import('@modules/config/ui/printer/printer.component').then((m) => m.PrinterComponent),
    data: {
      breadcrumb: 'Configuración Impresora',
    },
  },
  {
    path: 'wizard-config',
    title: 'Configuración Inicial',
    loadComponent: () =>
      import('@modules/config/ui/wizard-config/wizard-config.component').then(
        (m) => m.WizardConfigComponent,
      ),
    data: {
      breadcrumb: 'Configuración Inicial',
    },
  },
  {
    path: 'excel-import',
    title: 'Importación',
    loadComponent: () =>
      import('@modules/config/ui/excel-import/excel-import.component').then(
        (m) => m.ExcelImportComponent,
      ),
    data: {
      breadcrumb: 'Importación',
    },
  },
  {
    path: 'electronic-signature',
    loadComponent: () =>
      import('@modules/config/ui/electronic-signature/electronic-signature.component').then(
        (m) => m.ElectronicSignatureComponent,
      ),
    data: {
      breadcrumb: 'Firma Electronica',
    },
  },
  {
    path: 'credit-time',
    loadComponent: () =>
      import('@modules/config/ui/credit-time/credit-time-page').then(
        (m) => m.CreditTimePage,
      ),
    data: {
      breadcrumb: 'Tiempo Crédito',
    },
  },
  {
    path: 'shift',
    loadComponent: () => import('./ui/shift/shift.component').then((m) => m.ShiftComponent),
    data: {
      breadcrumb: 'Turno',
    },
  },
  {
    path: 'warehouse',
    loadComponent: () =>
      import('@inventory/ui/warehouse-page/warehouse-page').then((m) => m.WarehouseComponent),
    data: {
      breadcrumb: 'Bodega',
    },
  },
];
