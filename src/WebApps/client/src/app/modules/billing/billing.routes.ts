import { Route } from '@angular/router';
import { AtsComponent } from '@billing/ui/ats/ats.component';
import { FactElectReportPageComponent } from '@billing/ui/reports/fact-elect-report-page/fact-elect-report-page.component';
import { DocElectComponent } from '@billing/ui/doc-elect/doc-elect.component';
import { InvoiceComponent } from '@billing/ui/invoice/invoice.component';
import {GuiaRemisionComponent} from "@billing/ui/guia-remision/guia-remision.component";

export const routes: Route[] = [
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
    path: 'doc-elect',
    title: 'Documento Electrónico',
    component: DocElectComponent,
    data: {
      breadcrumb: 'Documento Electrónico',
    },
  },
  {
    path: 'invoice',
    title: 'Factura',
    component: InvoiceComponent,
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
  }
  }
];
