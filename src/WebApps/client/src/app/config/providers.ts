import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { injectSessionInterceptor } from '@core/interceptors/inject-session.interceptor';
import { loaderInterceptor } from '@core/interceptors/loader.interceptor';
import { purchaseProviders } from '@modules/purchase/providers';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { provideToastr } from 'ngx-toastr';
import { authMainProvider } from '@modules/auth/providers';
import { commonProviders } from '@modules/common/providers';
import { saleProvider } from '@sale/providers';
import { billingProviders } from '@modules/billing/providers';
import { DatePipe } from '@angular/common';
import { importProvidersFrom } from '@angular/core';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { barberShopProviders } from '@barber-shop/providers';
import { DATA_INVENTORY_IOC } from '@inventory/data/inventory.ioc';
import { DATA_CONFIG_IOC } from '@modules/config/data/data-config.ioc';
import {DATA_RESTAURANT_IOC} from "@restaurant/data/data-restaurant.ioc";
import {DATA_ACCOUNTING_IOC} from "@accounting/data-accounting.ioc";
import {DATA_REPORT_IOC} from "@modules/api/reports/data-report.ioc";
import { DATA_MECHANICAL_IOC } from '@modules/mechanical/data/data-mechanical.ioc';
import {DATA_CUSTOMER_IOC} from "@customer/data/data-customer.ioc";

export const infrastructureProviders = [
  provideHttpClient(
    withInterceptors([
      injectSessionInterceptor,
      loaderInterceptor,
      errorInterceptor,
    ]),
  ),
  provideAnimationsAsync(),
  provideEnvironmentNgxMask(),
];

export const uiProviders = [
  provideToastr({
    preventDuplicates: true,
    positionClass: 'toast-bottom-center',
    progressBar: true,
  }),
  importProvidersFrom(MatNativeDateModule),
  {
    provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
    useValue: { appearance: 'outline' },
  },
  {
    provide: MAT_DATE_LOCALE,
    useValue: 'es-MX',
  },
  DatePipe,
];

export const featureProviders = [
  ...DATA_INVENTORY_IOC,
  ...DATA_ACCOUNTING_IOC,
  ...purchaseProviders,
  ...authMainProvider,
  ...commonProviders,
  ...DATA_MECHANICAL_IOC,
  ...DATA_RESTAURANT_IOC,
  ...DATA_CONFIG_IOC,
  ...DATA_REPORT_IOC,
  ...DATA_CUSTOMER_IOC,
  ...saleProvider,
  ...billingProviders,
  ...barberShopProviders,
];
