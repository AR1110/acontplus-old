import { Provider } from '@angular/core';
import { AnticipoRepository } from '@accounting/movimiento-caja/domain/anticipo.repository';
import { AnticipoWebRepository } from '@accounting/movimiento-caja/infrastructure/anticipo-web.repository';
import { CajaHttp } from '@accounting/data/https/caja-http';
import { CategoryHttp } from '@accounting/data/https/category-http';
import { ComprobanteEgresoRepository } from '@accounting/data/repositories/comprobante-egreso.repository';
import { ComprobanteEgresoHttp } from '@accounting/data/https/comprobante-egreso-http';
import { ComprobanteIngresoRepository } from '@accounting/data/repositories/comprobante-ingreso-repository';
import { ComprobanteIngresoHttp } from '@accounting/data/https/comprobante-ingreso-http';
import { CuentaPorCobrarRepository } from '@accounting/cuenta-por-cobrar/domain/cuenta-por-cobrar.repository';
import { CuentaPorCobrarWebRepository } from '@accounting/cuenta-por-cobrar/infrastructure/cuenta-por-cobrar-web.repository';
import { CuentaPorPagarHttp } from '@accounting/data/https/cuenta-por-pagar-http';
import { MovimientoCajaRepository } from '@accounting/movimiento-caja/domain/movimiento-caja.repository';
import { MovimientoCajaWebRepository } from '@accounting/movimiento-caja/infrastructure/movimiento-caja-web.repository';
import { ResumenContableRepository } from '@accounting/data/repositories/resumen-contable.repository';
import { ResumenContableHttp } from '@accounting/data/https/resumen-contable-http';
import { SubCategoryRepository } from '@accounting/data/repositories/sub-category.repository';
import { SubCategoryHttp } from '@accounting/data/https/sub-category-http';
import { SubEntidadFinancieraHttp } from '@accounting/data/https/sub-entidad-financiera-http';
import {
  CAJA_HTTP_TOKEN,
  CUENTA_POR_PAGAR_HTTP_TOKEN,
  CONTROL_CAJA_HTTP_TOKEN,
  CATEGORY_HTTP_TOKEN,
  SUB_ENTIDAD_FINANCIERA_HTTP_TOKEN,
  SUB_CATEGORY_HTTP_TOKEN,
  COMPROBANTE_EGRESO_HTTP_TOKEN,
} from '@accounting/data/accounting-token';
import { ControlCajaHttp } from '@accounting/data/https/control-caja-http';

export const DATA_ACCOUNTING_IOC: Provider[] = [
  {
    provide: AnticipoRepository,
    useClass: AnticipoWebRepository,
  },
  {
    provide: CAJA_HTTP_TOKEN,
    useClass: CajaHttp,
  },
  {
    provide: CATEGORY_HTTP_TOKEN,
    useClass: CategoryHttp,
  },
  {
    provide: COMPROBANTE_EGRESO_HTTP_TOKEN,
    useClass: ComprobanteEgresoHttp,
  },
  {
    provide: ComprobanteIngresoRepository,
    useClass: ComprobanteIngresoHttp,
  },
  {
    provide: CONTROL_CAJA_HTTP_TOKEN,
    useClass: ControlCajaHttp,
  },
  {
    provide: CuentaPorCobrarRepository,
    useClass: CuentaPorCobrarWebRepository,
  },
  {
    provide: CUENTA_POR_PAGAR_HTTP_TOKEN,
    useClass: CuentaPorPagarHttp,
  },
  {
    provide: MovimientoCajaRepository,
    useClass: MovimientoCajaWebRepository,
  },
  {
    provide: ResumenContableRepository,
    useClass: ResumenContableHttp,
  },
  {
    provide: SUB_CATEGORY_HTTP_TOKEN,
    useClass: SubCategoryHttp,
  },
  {
    provide: SUB_ENTIDAD_FINANCIERA_HTTP_TOKEN,
    useClass: SubEntidadFinancieraHttp,
  },
];
