import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {injectSessionInterceptor} from "@core/interceptors/inject-session.interceptor";
import {errorInterceptor} from "@core/interceptors/error.interceptor";
import { provideToastr } from 'ngx-toastr';
import { loaderInterceptor } from './core/interceptors/loader.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([
        injectSessionInterceptor,
        loaderInterceptor,
        errorInterceptor,
      ]),
    ),
    provideToastr({
      preventDuplicates: true,
    }),
  ]
};
