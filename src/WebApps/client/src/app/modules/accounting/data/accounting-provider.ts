import { Provider } from '@angular/core';
import { AnticipoRepository } from '@accounting/movimiento-caja/domain/anticipo.repository';
import { AnticipoWebRepository } from '@accounting/movimiento-caja/infrastructure/anticipo-web.repository';
import { CajaHttp } from '@accounting/data/https/caja-http';
import { CategoryRepository } from '@accounting/category/domain/category.repository';
import { CategoryWebRepository } from '@accounting/category/infrastructure/category-web.repository';
import { ComprobanteEgresoRepository } from '@accounting/comprobante-egreso/domain/comprobante-egreso.repository';
import { ComprobanteEgresoWebRepository } from '@accounting/comprobante-egreso/infrastructure/comprobante-egreso-web.repository';
import { ComprobanteIngresoRepository } from '@accounting/comprobante-ingreso/domain/comprobante-ingreso.repository';
import { ComprobanteIngresoWebRepository } from '@accounting/comprobante-ingreso/infrastructure/comprobante-ingreso-web.repository';
import { ControlCajaRepository } from '@accounting/caja/domain/control-caja.repository';
import { ControlCajaWebRepository } from '@accounting/caja/infrastructure/control-caja-web.repository';
import { CuentaPorCobrarRepository } from '@accounting/cuenta-por-cobrar/domain/cuenta-por-cobrar.repository';
import { CuentaPorCobrarWebRepository } from '@accounting/cuenta-por-cobrar/infrastructure/cuenta-por-cobrar-web.repository';
import { CuentaPorPagarRepository } from '@accounting/cuenta-por-pagar/domain/cuenta-por-pagar.repository';
import { CuentaPorPagarWebRepository } from '@accounting/cuenta-por-pagar/infrastructure/cuenta-por-pagar-web.repository';
import { MovimientoCajaRepository } from '@accounting/movimiento-caja/domain/movimiento-caja.repository';
import { MovimientoCajaWebRepository } from '@accounting/movimiento-caja/infrastructure/movimiento-caja-web.repository';
import { ResumenContableRepository } from '@accounting/resumen-contable/domain/resumen-contable.repository';
import { ResumenContableWebRepository } from '@accounting/resumen-contable/infrastructure/resumen-contable-web.repository';
import { SubCategoryRepository } from '@accounting/sub-category/domain/sub-category.repository';
import { SubCategoryWebRepository } from '@accounting/sub-category/infrastructure/sub-category-web.repository';
import { SubEntidadFinancieraRepository } from '@accounting/sub-entidad-financiera/domain/sub-entidad-financiera.repository';
import { SubEntidadFinancieraWebRepository } from '@accounting/sub-entidad-financiera/infrastructure/sub-entidad-financiera-web.repository';
import {CAJA_HTTP_TOKEN} from "@accounting/data/accounting-token";

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
    provide: CategoryRepository,
    useClass: CategoryWebRepository,
  },
  {
    provide: ComprobanteEgresoRepository,
    useClass: ComprobanteEgresoWebRepository,
  },
  {
    provide: ComprobanteIngresoRepository,
    useClass: ComprobanteIngresoWebRepository,
  },
  {
    provide: ControlCajaRepository,
    useClass: ControlCajaWebRepository,
  },
  {
    provide: CuentaPorCobrarRepository,
    useClass: CuentaPorCobrarWebRepository,
  },
  {
    provide: CuentaPorPagarRepository,
    useClass: CuentaPorPagarWebRepository,
  },
  {
    provide: MovimientoCajaRepository,
    useClass: MovimientoCajaWebRepository,
  },
  {
    provide: ResumenContableRepository,
    useClass: ResumenContableWebRepository,
  },
  {
    provide: SubCategoryRepository,
    useClass: SubCategoryWebRepository,
  },
  {
    provide: SubEntidadFinancieraRepository,
    useClass: SubEntidadFinancieraWebRepository,
  },
];
