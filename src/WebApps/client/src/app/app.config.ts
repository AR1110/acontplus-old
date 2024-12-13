import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { injectSessionInterceptor } from '@core/interceptors/inject-session.interceptor';
import { loaderInterceptor } from '@core/interceptors/loader.interceptor';
import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { accountingProvider } from '@accounting/providers';
import { inventoryProviders } from '@inventory/providers';
import { purchaseProviders } from '@purchase/providers';
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
    provideEnvironmentNgxMask(),
    provideToastr({
      preventDuplicates: true,
      positionClass: 'toast-bottom-center',
    }),
    importProvidersFrom(
      FormsModule,
      QuillModule.forRoot({
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }], // text direction
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ['clean'],
            ['link', 'image', 'video'],
          ],
        },
      }),
    ),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      //  useValue: {appearance: 'outline', subscriptSizing: 'dynamic'}
      useValue: { appearance: 'outline', subscriptSizing: 'dynamic' },
    },
    ...accountingProvider,
    ...inventoryProviders,
    ...purchaseProviders,
  ],
};
