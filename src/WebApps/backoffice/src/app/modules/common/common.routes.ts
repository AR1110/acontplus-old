import { Route } from '@angular/router';
import { ReleasePageComponent } from '@modules/common/pages/release-page/release-page.component';
import { UserManualPageComponent } from '@modules/common/pages/user-manual-page/user-manual-page.component';

export const routes: Route[] = [
  {
    path: 'release-page',
    component: ReleasePageComponent,
    data: {
      breadcrumb: 'Lanzamientos',
    },
  },
  {
    path: 'user-manual-page',
    component: UserManualPageComponent,
    data: {
      breadcrumb: 'Manual de Usuario',
    },
  },
];
