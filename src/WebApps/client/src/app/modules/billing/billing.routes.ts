import { Route } from '@angular/router';

import { AtsPageComponent } from './pages/ats-page/ats-page.component';

export const routes : Route[] = [
  {
    path: 'ats-page',
    title: 'Ats',
    component: AtsPageComponent,
    data: {
      breadcrumb: 'Ats'
    }

  }
]
