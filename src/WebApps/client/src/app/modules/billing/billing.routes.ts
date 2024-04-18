import { Route } from '@angular/router';

import { AtsPageComponent } from './pages/ats-page/ats-page.component';

export const routes : Route[] = [
  {
    path: 'ats',
    title: 'Ats',
    component: AtsPageComponent,
    data: {
      breadcrumb: 'Ats'
    }

  }
]
