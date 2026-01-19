import { Type } from '@angular/core';
import { BugsComponent } from '@modules/common/presentation/bugs/bugs.component';
import { Route } from '@angular/router';
import { Ec2instancePageComponent } from '@modules/config/pages/ec2instance-page/ec2instance-page.component';
import { SistemaPageComponent } from '@modules/config/pages/sistema-page/sistema-page.component';
import { LicenseTypePageComponent } from '@modules/config/pages/license-type-page/license-type-page.component';
import { LicenciaPageComponent } from '@modules/config/pages/licencia-page/licencia-page.component';
import { MenuPageComponent } from '@modules/config/pages/menu-page/menu-page.component';
import { CompanyPageComponent } from '@modules/config/pages/company-page/company-page.component';
import { UserCustomerPageComponent } from '@modules/config/pages/user-customer-page/user-customer-page.component';
import { SuscriptionTypePageComponent } from '@modules/config/pages/suscription-type-page/suscription-type-page.component';
import { ReportPageComponent } from '@modules/config/pages/report-page/report-page.component';
import { QrWhatsappPageComponent } from '@modules/config/pages/qr-whatsapp-page/qr-whatsapp-page.component';
import { EmailSenderConfigPageComponent } from '@modules/config/pages/email-sender-config-page/email-sender-config-page.component';
import { SuscripcionPageComponent } from '@modules/sales/pages/suscripcion-page/suscripcion-page.component';
import { SchedulePageComponent } from '@modules/seguridad/pages/schedule-page/schedule-page.component';
import { ActionsComponent } from '@modules/seguridad/presentation/actions/actions.component';
import { UserCustomPermissionComponent } from '@modules/seguridad/presentation/user-custom-permission/user-custom-permission.component';
import { RolePageComponent } from '@modules/seguridad/pages/role-page/role-page.component';
import { ActividadEconomicaPageComponent } from '@modules/sri/pages/actividad-economica-page/actividad-economica-page.component';
import { CodigoRetencionPageComponent } from '@modules/sri/pages/codigo-retencion-page/codigo-retencion-page.component';
import { PorcentajeRetIvaPageComponent } from '@modules/sri/pages/porcentaje-ret-iva-page/porcentaje-ret-iva-page.component';
import { ReleasePageComponent } from '@modules/common/pages/release-page/release-page.component';
import { UserManualPageComponent } from '@modules/common/pages/user-manual-page/user-manual-page.component';
import { SuscripcionReportPageComponent } from '@modules/sales/pages/suscription-report-page/suscripcion-report-page.component';
import {DashboardComponent} from "@modules/home/components/dashboard/dashboard.component";
import {LicenseAccessComponent} from "@modules/seguridad/presentation/license-access/license-access.component";

export interface MenuItemList {
  icon?: string;
  label?: string;
  route: string;
  subItems?: MenuItemList[];
  component?: Type<unknown>;
  data?: {
    breadcrumb: string;
  };
  loadChildren?: () => Promise<Route[]>;
  redirectTo?: string;
  routeMatch?: "full";
}

export const menuItems: MenuItemList[] = [
  {
    icon: 'home',
    route: '',
    label: 'Dashboard',
    routeMatch: 'full',
    component: DashboardComponent,
    data: {
      breadcrumb: 'Dashboard'
    }
  },
  {
    icon: 'settings',
    route: 'config',
    label: 'Configuración',
    data: {
      breadcrumb: 'Config',
    },
    subItems: [
      {
        route: 'ec2instance', // Relative path for children
        label: 'Instancias AWS',
        component: Ec2instancePageComponent,
        data: {
          breadcrumb: 'EC2instance',
        },
        subItems: [
          {
            route: 'ec2instance', // Relative path for children
            label: 'Instancias AWS',
            component: Ec2instancePageComponent,
            data: {
              breadcrumb: 'Test Instance',
            },
          },
        ]
      },
      {
        route: 'sistema',
        label: 'Sistema',
        component: SistemaPageComponent,
        data: {
          breadcrumb: 'Sistema',
        },
      },
      {
        route: 'license-type',
        label: 'Tipo de Licencia',
        component: LicenseTypePageComponent,
        data: {
          breadcrumb: 'Tipo de Licencia',
        },
      },
      {
        route: 'licencia',
        label: 'Licencia',
        component: LicenciaPageComponent,
        data: {
          breadcrumb: 'Licencia',
        },
      },
      {
        route: 'menu',
        label: 'Menú',
        component: MenuPageComponent,
        data: {
          breadcrumb: 'Menu',
        },
      },
      {
        route: 'company',
        label: 'Empresa',
        component: CompanyPageComponent,
        data: {
          breadcrumb: 'Empresa',
        },
      },
      {
        route: 'user-customer',
        label: 'Usuario Cliente',
        component: UserCustomerPageComponent,
        data: {
          breadcrumb: 'Usuario Cliente',
        },
      },
      {
        route: 'subscription-type',
        label: 'Tipo de Suscripción',
        component: SuscriptionTypePageComponent,
        data: {
          breadcrumb: 'Tipo Suscripción',
        },
      },
      {
        route: 'report',
        label: 'Reporte',
        component: ReportPageComponent,
        data: {
          breadcrumb: 'Reporte',
        },
      },
      {
        route: 'qr-whatsapp',
        label: 'QR WhatsApp',
        component: QrWhatsappPageComponent,
        data: {
          breadcrumb: 'QR WhatsApp',
        },
      },
      {
        route: 'email-sender-config',
        label: 'Email Sender',
        component: EmailSenderConfigPageComponent,
        data: {
          breadcrumb: 'Email Sender Config',
        },
      },
    ],
  },
  {
    route: 'security',
    label: 'Seguridad',
    icon: 'lock', // Material Icon
    subItems: [
      {
        route: 'license-access',
        label: 'Accesos',
        component: LicenseAccessComponent,
        data: {
          breadcrumb: 'Accesos',
        },
      },
      {
        route: 'schedule',
        label: 'Horarios',
        component: SchedulePageComponent,
        data: {
          breadcrumb: 'Horarios',
        },
      },
      {
        route: 'actions',
        label: 'Acciones',
        component: ActionsComponent,
        data: {
          breadcrumb: 'Acciones',
        },
      },
      {
        route: 'custom-role',
        label: 'Roles',
        component: RolePageComponent,
        data: {
          breadcrumb: 'Roles',
        },
      },
      {
        route: 'user-custom-permission',
        label: 'Permisos personalizados',
        component: UserCustomPermissionComponent,
        data: {
          breadcrumb: 'Permisos Personalizados',
        },
      },
    ],
    data: {
      breadcrumb: 'Seguridad',
    },
  },
  {
    route: 'sale',
    label: 'Ventas',
    icon: 'payments',
    subItems: [
      {
        label: 'Suscripciones',
        route: 'subscription',
        component: SuscripcionPageComponent,
        data: {
          breadcrumb: 'Suscripción',
        },
      },
    ],
    data: {
      breadcrumb: 'Ventas',
    },
  },

  {
    route: 'sri',
    label: 'SRI', // Capitalized for acronym
    icon: 'article', // A more suitable icon for tax/document related items
    subItems: [
      {
        route: 'actividad-economica',
        label: 'Actividad Económica',
        component: ActividadEconomicaPageComponent,
        data: {
          breadcrumb: 'Actividad Económica',
        },
      },
      {
        route: 'codigo-retencion',
        label: 'Código Retención',
        component: CodigoRetencionPageComponent,
        data: {
          breadcrumb: 'Código Retención',
        },
      },
      {
        route: 'porcentaje-ret-iva',
        label: 'Porcentaje Retención IVA', // Corrected spelling and capitalized IVA
        component: PorcentajeRetIvaPageComponent,
        data: {
          breadcrumb: 'Porcentaje Retención Iva',
        },
      },
      // Removed duplicate 'porcentaje-ret-iva' entry
    ],
    data: {
      breadcrumb: 'Sri',
    },
  },
  {
    route: 'common',
    data: {
      breadcrumb: 'Common',
    },
    label: 'Módulos Generales',
    icon: 'apps', // A more suitable icon for general modules/apps
    subItems: [
      {
        route: 'release-page',
        label: 'Lanzamientos',
        component: ReleasePageComponent,
        data: {
          breadcrumb: 'Lanzamientos',
        },
      },
      {
        route: 'user-manual-page',
        label: 'Manual de Usuario', // Capitalized for consistency
        component: UserManualPageComponent,
        data: {
          breadcrumb: 'Manual de Usuario',
        },
      },
      {
        route: 'bugs',
        component: BugsComponent,
        label: 'Errores AcontPlus',
        data: {
          breadcrumb: 'Errores Sistema',
        },
      },
    ],
  },

  {
    route: 'reports',
    label: 'Reportes',
    icon: 'bar_chart', // Changed from 'balance-scale' to 'bar_chart' (Material Icon)
    subItems: [
      {
        route: 'subscription-report',
        label: 'Suscripciones',
        component: SuscripcionReportPageComponent,
        data: {
          breadcrumb: 'Reporte de Suscripciones',
        },
      },
    ],
    data: {
      breadcrumb: 'Reports',
    },
  },


];
