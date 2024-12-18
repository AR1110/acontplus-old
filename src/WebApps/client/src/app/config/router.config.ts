import { provideRouter } from "@angular/router";

import { withViewTransitions } from "@angular/router";
import { routes } from "../app.routes";

export const routerConfig = [
  provideRouter(
    routes,
    withViewTransitions({
      skipInitialTransition: true
    })
  )
];
