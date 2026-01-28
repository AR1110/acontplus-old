export interface MenusRoute {
  path: string;
  title: string;
  // Changed IconProp to string for Material Icon names
  icon?: string;
  children?: MenusRoute[]; // Made children optional for standalone items
}

export const menusRoutes: MenusRoute[] = [
  {
    path: 'config',
    title: 'Configuración',
    icon: 'settings', // Changed from 'cogs' to 'settings' (Material Icon)
    children: [
      {
        path: 'ec2instance', // Relative path for children
        title: 'Instancias AWS',
      },
      {
        path: 'sistema',
        title: 'Sistema',
      },
      {
        path: 'license-type',
        title: 'Tipo de Licencia',
      },
      {
        path: 'licencia',
        title: 'Licencia',
      },
      {
        path: 'menu',
        title: 'Menú',
      },
      {
        path: 'company',
        title: 'Empresa',
      },
      {
        path: 'user-customer',
        title: 'Usuario Cliente',
      },
      {
        path: 'subscription-type',
        title: 'Tipo de Suscripción',
      },
      {
        path: 'report',
        title: 'Reporte',
      },
      {
        path: 'qr-whatsapp',
        title: 'QR WhatsApp',
      },
      {
        path: 'email-sender-config',
        title: 'Email Sender',
      },
    ],
  },
  {
    path: 'security',
    title: 'Seguridad',
    icon: 'lock', // Material Icon
    children: [
      {
        path: 'accesos',
        title: 'Accesos',
      },
      {
        path: 'schedule',
        title: 'Horarios',
      },
      {
        path: 'actions',
        title: 'Acciones',
      },
      {
        path: 'custom-role',
        title: 'Roles',
      },
      {
        path: 'user-custom-permission',
        title: 'Permisos personalizados',
      },
    ],
  },
  {
    path: 'sale',
    title: 'Ventas',
    icon: 'payments', // Changed from 'money-check-dollar' to 'payments' (Material Icon)
    children: [
      {
        path: 'subscription',
        title: 'Suscripciones',
      },
    ],
  },
  {
    path: 'sri',
    title: 'SRI', // Capitalized for acronym
    icon: 'article', // A more suitable icon for tax/document related items
    children: [
      {
        path: 'actividad-economica',
        title: 'Actividad Económica',
      },
      {
        path: 'codigo-retencion',
        title: 'Código Retención',
      },
      {
        path: 'porcentaje-ret-iva',
        title: 'Porcentaje Retención IVA', // Corrected spelling and capitalized IVA
      },
      // Removed duplicate 'porcentaje-ret-iva' entry
    ],
  },
  {
    path: 'common',
    title: 'Módulos Generales',
    icon: 'apps', // A more suitable icon for general modules/apps
    children: [
      {
        path: 'release-page',
        title: 'Lanzamientos',
      },
      {
        path: 'user-manual-page',
        title: 'Manual de Usuario', // Capitalized for consistency
      },
    ],
  },
  {
    path: 'reports',
    title: 'Reportes',
    icon: 'bar_chart', // Changed from 'balance-scale' to 'bar_chart' (Material Icon)
    children: [
      {
        path: 'subscription-report',
        title: 'Suscripciones',
      },
    ],
  },
];
