import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { ConsolidacionBodega } from '@inventory/data/models/consolidacion-bodega.model';
import { MedidaProducto } from '@inventory/data/models/measure.model';
import { TarifaProducto } from '@inventory/data/models/tarifa.model';

export class FieldDefinitionDetailSale {
  rowguid: string = generateUuidv4();
  bodegaId = 0;
  feeId = 0;
  medidaId = 0;
  productId = 0;
  descripcion = '';
  codigo = '';
  taxId = 0;
  taxPercentId = 0;
  quantity = 0;
  cost = 0;
  precioConIva = 0;
  taxValue = 0;
  price = 0;
  percentageDiscount = 0;
  discount = 0;
  precioTotalSinImpuesto = 0;
  total = 0;
  obs?: string | null = null;
  medidas: MedidaProducto[] = [];
  tarifas: TarifaProducto[] = [];
  consolidacionesBodega!: ConsolidacionBodega[];
  costoFraccionado = 0;
  llevaInventario = false;
  conversion = 1;
  percentage?: number = 0;
}
