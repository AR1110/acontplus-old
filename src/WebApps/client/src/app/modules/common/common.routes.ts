import { Route } from '@angular/router';
import { UserManualPageComponent } from '@modules/common/ui/user-manual/user-manual-page.component';

export const routes: Route[] = [
  {
    path: 'user-manual',
    title: 'Manual de Usuario',
    component: UserManualPageComponent,
    data: {
      breadcrumb: 'Manual de Usuario',
    },
  },
];
