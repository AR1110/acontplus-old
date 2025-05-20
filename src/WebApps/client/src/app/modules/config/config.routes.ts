import { Routes } from '@angular/router';
import { DocConfigPageComponent } from '@modules/config/ui/doc-config/doc-config.component';
import { SolicitudAutorizacionComponent } from '@modules/config/ui/solicitud-autorizacion/solicitud-autorizacion.component';
import { UserProfilePageComponent } from '@modules/config/ui/user-profile-page/user-profile-page.component';
import { EstablishmentPageComponent } from '@modules/config/ui/establishment-page/establishment-page.component';
import { CompanyComponent } from '@modules/config/ui/company/company.component';
import { PrinterComponent } from '@modules/config/ui/printer/printer.component';
import { WizardConfigComponent } from '@modules/config/ui/wizard-config/wizard-config.component';
import { TiempoCreditoPageComponent } from '@modules/config/ui/tiempo-credito-page/tiempo-credito-page.component';
import { UserCustomerComponent } from '@modules/config/ui/user-customer/user-customer.component';
import { GeneralConfigComponent } from '@modules/config/ui/general-config/general-config.component';
import {ExcelImportComponent} from "@modules/config/ui/excel-import/excel-import.component";
import {ElectronicSignatureComponent} from "@modules/config/ui/electronic-signature/electronic-signature.component";
import {CreditTimeComponent} from "@modules/config/ui/credit-time/credit-time.component";

export const routes: Routes = [
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
    component:ElectronicSignatureComponent,
    data: {
      breadcrumb: 'Firma Eletrónica'
    }
  },
  {
    path: 'credit-time',
    component: CreditTimeComponent,
    data: {
      breadcrumb: 'Tiempo Crédito'
    }
  }
];
