import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { loaderInterceptor } from '@core/interceptors/loader.interceptor';
import { purchaseProviders } from '@purchase/providers';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { authMainProvider } from '@modules/auth/providers';
import { commonProviders } from '@modules/common/providers';
import { billingProviders } from '@billing/providers';
import { barberShopProviders } from '@barber-shop/providers';
import { DATA_INVENTORY_IOC } from '@inventory/data/inventory-provider';
import { DATA_CONFIG_IOC } from '@modules/config/data/data-config.ioc';
import { DATA_RESTAURANT_IOC } from '@restaurant/data/data-restaurant.ioc';
import { DATA_ACCOUNTING_IOC } from '@accounting/data-accounting.ioc';
import { DATA_REPORT_IOC } from '@modules/api/reports/data-report.ioc';
import { DATA_MECHANICAL_IOC } from '@mechanical/data/data-mechanical.ioc';
import { DATA_CUSTOMER_IOC } from '@customer/data/data-customer.ioc';
import { settingsInterceptor } from '@core/interceptors/settings-interceptor';
import { noopInterceptor } from '@core/interceptors/noop-interceptor';
import { injectSessionInterceptor } from '@core/interceptors/inject-session.interceptor';
import { DATA_SALE_IOC } from '@sale/data/sale.ioc';

export const infrastructureProviders = [
  provideHttpClient(
    withInterceptors([
      noopInterceptor,
      injectSessionInterceptor,
      settingsInterceptor,
      loaderInterceptor,
      errorInterceptor,
    ]),
  ),
  provideAnimationsAsync(),
  provideEnvironmentNgxMask(),
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
  ...DATA_SALE_IOC,
  ...billingProviders,
  ...barberShopProviders,
];
