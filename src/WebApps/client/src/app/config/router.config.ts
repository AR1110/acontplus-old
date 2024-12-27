import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from '../app.routes';

export const routerConfig = [
  provideRouter(
    routes,
    withViewTransitions({
      skipInitialTransition: true,
    }),
  ),
];
