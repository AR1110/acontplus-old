import { Route } from '@angular/router';

import { AtsPageComponent } from './pages/ats-page/ats-page.component';
import {FactElectReportPageComponent} from "@billing/reports/fact-elect-report-page/fact-elect-report-page.component";
import { DocElectPageComponent } from './pages/doc-elect-page/doc-elect-page.component';
import { InvoicePageComponent } from './pages/invoice-page/invoice-page.component';

export const routes : Route[] = [
  {
    path: 'ats-page',
    title: 'Ats',
    component: AtsPageComponent,
    data: {
      breadcrumb: 'Ats'
    }

  },
  {
    path: 'fact-elect-report',
    title: 'Reporte Tributario',
    component: FactElectReportPageComponent,
    data: {
      breadcrumb: 'Reporte Tributario',
    }

  },

  {
    path: 'doc-elect',
    title: 'Documento Electrónico',
    component: DocElectPageComponent,
    data: {
      breadcrumb: 'Documento Electrónico',
    }

  },
  {
    path: 'invoice',
    title: 'Factura',
    component: InvoicePageComponent,
    data: {
      breadcrumb: 'Factura',
    }

  }
]
