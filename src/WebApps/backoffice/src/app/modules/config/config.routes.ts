import { Route } from '@angular/router';

import { CompanyPageComponent } from './pages/company-page/company-page.component';
import { Ec2instancePageComponent } from './pages/ec2instance-page/ec2instance-page.component';
import { LicenseTypePageComponent } from './pages/license-type-page/license-type-page.component';
import { LicenciaPageComponent } from './pages/licencia-page/licencia-page.component';
import { MenuPageComponent } from './pages/menu-page/menu-page.component';
import { SistemaPageComponent } from './pages/sistema-page/sistema-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { SuscriptionTypePageComponent } from './pages/suscription-type-page/suscription-type-page.component';
import { UserCustomerPageComponent } from './pages/user-customer-page/user-customer-page.component';
import { ReportPageComponent } from '@modules/config/pages/report-page/report-page.component';
import { QrWhatsappPageComponent } from '@modules/config/pages/qr-whatsapp-page/qr-whatsapp-page.component';
import { EmailSenderConfigPageComponent } from '@modules/config/pages/email-sender-config-page/email-sender-config-page.component';

export const routes: Route[] = [
  {
    path: 'company',
    component: CompanyPageComponent,
    data: {
      breadcrumb: 'Empresa',
    },
  },
  {
    path: 'ec2instance',
    component: Ec2instancePageComponent,
    data: {
      breadcrumb: 'EC2instance',
    },
  },
  {
    path: 'license-type',
    component: LicenseTypePageComponent,
    data: {
      breadcrumb: 'Tipo de Licencia',
    },
  },
  {
    path: 'licencia',
    component: LicenciaPageComponent,
    data: {
      breadcrumb: 'Licencia',
    },
  },
  {
    path: 'menu',
    component: MenuPageComponent,
    data: {
      breadcrumb: 'Menu',
    },
  },
  {
    path: 'sistema',
    component: SistemaPageComponent,
    data: {
      breadcrumb: 'Sistema',
    },
  },
  {
    path: 'user',
    component: UserPageComponent,
    data: {
      breadcrumb: 'Usuario',
    },
  },
  {
    path: 'user-customer',
    component: UserCustomerPageComponent,
    data: {
      breadcrumb: 'Usuario Cliente',
    },
  },
  {
    path: 'subscription-type',
    component: SuscriptionTypePageComponent,
    data: {
      breadcrumb: 'Tipo Suscripción',
    },
  },
  {
    path: 'report',
    component: ReportPageComponent,
    data: {
      breadcrumb: 'Reporte',
    },
  },
  {
    path: 'qr-whatsapp',
    component: QrWhatsappPageComponent,
    data: {
      breadcrumb: 'QR WhatsApp',
    },
  },

  {
    path: 'email-sender-config',
    component: EmailSenderConfigPageComponent,
    data: {
      breadcrumb: 'Email Sender Config',
    },
  },
];
