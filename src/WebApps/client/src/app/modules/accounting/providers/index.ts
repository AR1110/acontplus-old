import {comprobanteIngresoProvider} from "@accounting/providers/comprobante-ingreso.provider";
import {cuentaPorPagarProvider} from "@accounting/providers/cuenta-por-pagar.provider";
import {comprobanteEgresoProvider} from "@accounting/providers/comprobante-egreso.provider";
import {subEntidadFinancieraProvider} from "@accounting/providers/sub-entidad-financiera.provider";
import {cajaProvider} from "@accounting/providers/caja.provider";
import {subCategoryProvider} from "@accounting/providers/sub-category.provider";


export default  [
  comprobanteIngresoProvider,
  comprobanteEgresoProvider,
  cuentaPorPagarProvider,
  subEntidadFinancieraProvider,
  cajaProvider,
  subCategoryProvider
]
