import { CajaRepository } from '@accounting/data/repositories/caja-repository';
import { InjectionToken } from '@angular/core';
import { CuentaPorPagarRepository } from '@accounting/data/repositories/cuenta-por-pagar.repository';
import { ControlCajaRepository } from '@accounting/data/repositories/control-caja.repository';
import { CategoryRepository } from '@accounting/data/repositories/category.repository';
import { SubEntidadFinancieraRepository } from '@accounting/data/repositories/sub-entidad-financiera.repository';
import { SubCategoryRepository } from '@accounting/data/repositories/sub-category.repository';

export const CAJA_HTTP_TOKEN = new InjectionToken<CajaRepository>('CAJA_HTTP_TOKEN');

export const CUENTA_POR_PAGAR_HTTP_TOKEN = new InjectionToken<CuentaPorPagarRepository>(
  'CUENTA_POR_PAGAR_HTTP_TOKEN',
);

export const CONTROL_CAJA_HTTP_TOKEN = new InjectionToken<ControlCajaRepository>(
  'CONTROL_CAJA_HTTP_TOKEN',
);

export const CATEGORY_HTTP_TOKEN = new InjectionToken<CategoryRepository>('CATEGORY_HTTP_TOKEN');

export const SUB_ENTIDAD_FINANCIERA_HTTP_TOKEN = new InjectionToken<SubEntidadFinancieraRepository>(
  'SUB_ENTIDAD_FINANCIERA_HTTP_TOKEN',
);

export const SUB_CATEGORY_HTTP_TOKEN = new InjectionToken<SubCategoryRepository>(
  'SUB_CATEGORY_HTTP_TOKEN',
);
