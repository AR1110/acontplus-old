import {comprobanteIngresoProvider} from "@accounting/providers/comprobante-ingreso.provider";
import {cuentaPorPagarProvider} from "@accounting/providers/cuenta-por-pagar.provider";
import {comprobanteEgresoProvider} from "@accounting/providers/comprobante-egreso.provider";
import {subEntidadFinancieraProvider} from "@accounting/providers/sub-entidad-financiera.provider";
import {cajaProvider} from "@accounting/providers/caja.provider";
import {subCategoryProvider} from "@accounting/providers/sub-category.provider";
import {movimientoCajaProvider} from "@accounting/providers/movimiento-caja.provider";
import {anticipoProvider} from "@accounting/providers/anticipo.provider";
import {cuentaPorCobrarProvider} from "@accounting/providers/cuenta-por-cobrar.provider";
import {controlCajaProvider} from "@accounting/providers/control-caja.provider";
import {resumenContableProvider} from "@accounting/providers/resumen-contable.provider";
import {categoryProvider} from "@accounting/providers/category.provider";


export const accountingProvider = [
  comprobanteIngresoProvider,
  comprobanteEgresoProvider,
  cuentaPorPagarProvider,
  subEntidadFinancieraProvider,
  cajaProvider,
  subCategoryProvider,
  movimientoCajaProvider,
  anticipoProvider,
  cuentaPorCobrarProvider,
  controlCajaProvider,
  resumenContableProvider,
  categoryProvider
]
