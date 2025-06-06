import {Provider} from "@angular/core";
import {AnticipoRepository} from "@accounting/domain/repositories/anticipo.repository";
import {AnticipoWebRepository} from "@accounting/data/anticipo/anticipo-web.repository";
import {CajaRepository} from "@accounting/domain/repositories/caja.repository";
import {CajaWebRepository} from "@accounting/data/caja/caja-web.repository";
import {CategoryRepository} from "@accounting/domain/repositories/category.repository";
import {CategoryWebRepository} from "@accounting/data/category/category-web.repository";
import {ComprobanteEgresoRepository} from "@accounting/domain/repositories/comprobante-egreso.repository";
import {ComprobanteEgresoWebRepository} from "@accounting/data/comprobante-egreso/comprobante-egreso-web.repository";
import {ComprobanteIngresoRepository} from "@accounting/domain/repositories/comprobante-ingreso.repository";
import {ComprobanteIngresoWebRepository} from "@accounting/data/comprobante-ingreso/comprobante-ingreso-web.repository";
import {ControlCajaRepository} from "@accounting/domain/repositories/control-caja.repository";
import {ControlCajaWebRepository} from "@accounting/data/control-caja/control-caja-web.repository";
import {CuentaPorCobrarRepository} from "@accounting/domain/repositories/cuenta-por-cobrar.repository";
import {CuentaPorCobrarWebRepository} from "@accounting/data/cuenta-por-cobrar/cuenta-por-cobrar-web.repository";
import {CuentaPorPagarRepository} from "@accounting/domain/repositories/cuenta-por-pagar.repository";
import {CuentaPorPagarWebRepository} from "@accounting/data/cuenta-por-pagar/cuenta-por-pagar-web.repository";
import {MovimientoCajaRepository} from "@accounting/domain/repositories/movimiento-caja.repository";
import {MovimientoCajaWebRepository} from "@accounting/data/movimiento-caja/movimiento-caja-web.repository";
import {ResumenContableRepository} from "@accounting/domain/repositories/resumen-contable.repository";
import {ResumenContableWebRepository} from "@accounting/data/resumen-contable/resumen-contable-web.repository";
import {SubCategoryRepository} from "@accounting/domain/repositories/sub-category.repository";
import {SubCategoryWebRepository} from "@accounting/data/sub-category/sub-category-web.repository";
import {SubEntidadFinancieraRepository} from "@accounting/domain/repositories/sub-entidad-financiera.repository";
import {
  SubEntidadFinancieraWebRepository
} from "@accounting/data/sub-entidad-financiera/sub-entidad-financiera-web.repository";


export const DATA_ACCOUNTING_IOC:Provider[] = [
  {
    provide: AnticipoRepository,
    useClass: AnticipoWebRepository
  },
  {
    provide: CajaRepository,
    useClass: CajaWebRepository
  },
  {
    provide: CategoryRepository,
    useClass: CategoryWebRepository
  },
  {
    provide: ComprobanteEgresoRepository,
    useClass: ComprobanteEgresoWebRepository
  },
  {
    provide: ComprobanteIngresoRepository,
    useClass: ComprobanteIngresoWebRepository
  },
  {
    provide: ControlCajaRepository,
    useClass: ControlCajaWebRepository
  },
  {
    provide: CuentaPorCobrarRepository,
    useClass: CuentaPorCobrarWebRepository
  },
  {
    provide: CuentaPorPagarRepository,
    useClass: CuentaPorPagarWebRepository
  },
  {
    provide: MovimientoCajaRepository,
    useClass: MovimientoCajaWebRepository
  },
  {
    provide: ResumenContableRepository,
    useClass: ResumenContableWebRepository
  },
  {
    provide: SubCategoryRepository,
    useClass: SubCategoryWebRepository
  },
  {
    provide: SubEntidadFinancieraRepository,
    useClass: SubEntidadFinancieraWebRepository
  }

]
