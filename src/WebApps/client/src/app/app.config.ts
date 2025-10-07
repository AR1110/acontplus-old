import {
  ApplicationConfig,
  importProvidersFrom, inject, provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  featureProviders,
  infrastructureProviders,
  uiProviders,
} from './config/providers';
import { editorProviders } from './config/editor.config';
import { FormsModule } from '@angular/forms';
import {provideRouter, withComponentInputBinding, withInMemoryScrolling} from "@angular/router";
import {routes} from "./app.routes";
import {TranslateLangService} from "@core/bootstrap";
import { FORMLY_CONFIG, provideFormlyCore } from '@ngx-formly/core';
import {formlyConfigFactory} from "@shared/formly-config";
import {TranslateService} from "@ngx-translate/core";
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideAppInitializer(() => inject(TranslateLangService).load()),
    ...infrastructureProviders,
    ...uiProviders,

    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withComponentInputBinding()
    ),
    ...editorProviders,
    ...featureProviders,
    importProvidersFrom(FormsModule),
    {
      provide: FORMLY_CONFIG,
      useFactory: formlyConfigFactory,
      deps: [TranslateService],
      multi: true,
    },
  ],
};
