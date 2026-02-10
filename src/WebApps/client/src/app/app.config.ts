import { REPORT_PORT, ReportAdapter } from '@acontplus/ng-common';
import { provideNotifications } from '@acontplus/ng-notifications';
import { DatePipe } from '@angular/common';
import { HttpBackend } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { SettingsService, TranslateLangService } from '@core/bootstrap';
import { customTranslateLoaderFactory } from '@core/i18n/custom-translate-loader';
import { BASE_URL } from '@core/interceptors/base-url-interceptor';
import { FORMLY_CONFIG } from '@ngx-formly/core';
import { provideTranslateService, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { purchasesProvider } from '@purchases/data/purchases-provider';
import { formlyConfigFactory } from '@shared/formly-config';
import { provideToastr } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { routes } from './app.routes';
import { editorProviders } from './editor.config';
import { featureProviders, infrastructureProviders } from './providers';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: BASE_URL, useValue: environment.baseUrl },
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideAppInitializer(() => inject(TranslateLangService).load()),
    ...infrastructureProviders,
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withComponentInputBinding(),
    ),
    ...editorProviders,
    ...featureProviders,
    ...purchasesProvider,
    importProvidersFrom(FormsModule),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: customTranslateLoaderFactory,
        deps: [HttpBackend],
      },
    }),
    {
      provide: FORMLY_CONFIG,
      useFactory: formlyConfigFactory,
      deps: [TranslateService],
      multi: true,
    },
    {
      provide: MAT_DATE_LOCALE,
      useFactory: () => inject(SettingsService).getLocale(),
    },
    provideToastr({
      preventDuplicates: true,
      positionClass: 'toast-bottom-center',
      progressBar: true,
    }),
    importProvidersFrom(MatNativeDateModule),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
      //      useValue: { appearance: 'outline',  subscriptSizing:"dynamic" },
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'es-MX',
    },
    DatePipe,
    provideNotifications({
      defaultProvider: 'snackbar',
    }),
    { provide: REPORT_PORT, useClass: ReportAdapter },
  ],
};
