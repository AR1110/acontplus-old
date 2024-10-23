import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { injectSessionInterceptor } from '@core/interceptors/inject-session.interceptor';
import { loaderInterceptor } from '@core/interceptors/loader.interceptor';
import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions({ skipInitialTransition: true })),
    provideHttpClient(
      withInterceptors([
        injectSessionInterceptor,
        loaderInterceptor,
        errorInterceptor,
      ]),
    ),
    provideAnimationsAsync(),
    provideToastr({
      preventDuplicates: true,
    }),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
    //  useValue: {appearance: 'outline', subscriptSizing: 'dynamic'}
      useValue: {appearance: 'outline', subscriptSizing: 'dynamic'}
    }
  ],
};
