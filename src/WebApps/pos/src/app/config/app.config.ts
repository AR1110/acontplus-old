import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { errorInterceptor } from "@core/interceptors/error.interceptor";
import { injectSessionInterceptor } from "@core/interceptors/inject-session.interceptor";
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { loaderInterceptor } from '@core/interceptors/loader.interceptor';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import {featureProviders} from "@/config/providers";


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
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
    provideCharts(withDefaultRegisterables()),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
    //  useValue: {appearance: 'outline', subscriptSizing: 'dynamic'}
      useValue: {appearance: 'outline', subscriptSizing: 'dynamic'}
    },
    ...featureProviders
  ]
};
