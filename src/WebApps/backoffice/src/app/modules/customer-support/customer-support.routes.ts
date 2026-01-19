import { Route } from '@angular/router';
import { TicketPageComponent } from './pages/ticket-page/ticket-page.component';

export const routes: Route[] = [
    {
      path: 'ticket',
      component: TicketPageComponent,
      data: {
        breadcrumb: 'Tickets',
      }
    },
];
