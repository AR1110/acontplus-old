import { Route } from '@angular/router';

import { AtsPageComponent } from './pages/ats-page/ats-page.component';
import {FactElectReportPageComponent} from "@billing/reports/fact-elect-report-page/fact-elect-report-page.component";

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

  }
]
