import { generateUuidv4 } from "@core/utils/generate-uuidv4";
import { ConsolidacionBodega } from "@modules/inventory/shared/models/consolidacion-bodega.model";
import { MedidaProducto } from "@modules/inventory/shared/models/measure.model";
import { TarifaProducto } from "@modules/inventory/shared/models/tarifa.model";

export class FieldDefinitionDetailSale {
  rowguid: string = generateUuidv4()
  bodegaId: number = 0;
  feeId: number = 0;
  medidaId: number = 0;
  productId: number = 0;
  descripcion: string = ""
  codigo: string = ""
  taxId: number = 0;
  taxPercentId: number = 0;
  quantity: number = 0;
  cost: number = 0;
  precioConIva: number = 0;
  taxValue: number = 0;
  price: number = 0;
  percentageDiscount: number =0;
  discount: number = 0;
  precioTotalSinImpuesto: number = 0;
  total: number = 0;
  obs?: string | null = null
  medidas: MedidaProducto[] = []
  tarifas: TarifaProducto[] = []
  consolidacionesBodega!: ConsolidacionBodega[];
  costoFraccionado: number = 0;
  llevaInventario: boolean = false
  conversion: number= 1;
}


