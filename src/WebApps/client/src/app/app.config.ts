import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  featureProviders,
  infrastructureProviders,
  uiProviders,
} from './config/providers';
import { routerConfig } from './config/router.config';
import { editorProviders } from './config/editor.config';
import { FormsModule } from '@angular/forms';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    ...infrastructureProviders,
    ...uiProviders,
    ...routerConfig,
    ...editorProviders,
    ...featureProviders,
    importProvidersFrom(FormsModule),
  ],
};
