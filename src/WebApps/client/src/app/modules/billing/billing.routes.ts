import { Route } from '@angular/router';
import { AtsComponent } from '@billing/ui/ats/ats.component';
import { FactElectReportPageComponent } from '@billing/ui/reports/fact-elect-report-page/fact-elect-report-page.component';
import { DocElect } from '@billing/ui/doc-elect/doc-elect';
import { Invoice } from '@billing/ui/invoice/invoice';
import { GuiaRemisionComponent } from '@billing/ui/guia-remision/guia-remision.component';
import { BillingHomeComponent } from './ui/billing-home.component';
import {ACTION_ALIASES} from "@core/constants/permission-actions";
import {BILLING_MODULES_CODE} from "@billing/domain/enums/billing.enum.ts";

export const routes: Route[] = [
  {
    path: '',
    component: BillingHomeComponent,
    data: { breadcrumb: 'Facturación' },
  },
  {
    path: 'ats',
    title: 'Ats',
    component: AtsComponent,
    data: {
      breadcrumb: 'Ats',
    },
  },
  {
    path: 'fact-elect-report',
    title: 'Reporte Tributario',
    component: FactElectReportPageComponent,
    data: {
      breadcrumb: 'Reporte Tributario',
    },
  },

  {
    path: 'doc-elects',
    title: 'Documento Electrónico',
    component: DocElect,
    data: {
      breadcrumb: 'Documento Electrónico',
      context: BILLING_MODULES_CODE.DOC_ELECT,
      requiredActions: [ACTION_ALIASES.READ]
    },
  },

  {
    path: 'invoices',
    title: 'Factura',
    component: Invoice,
    data: {
      breadcrumb: 'Factura',
    },
  },
  {
    path: 'guia-remision',
    title: 'Guia Remisión',
    component: GuiaRemisionComponent,
    data: {
      breadcrumb: 'Guía de Remisión',
    },
  },
];
