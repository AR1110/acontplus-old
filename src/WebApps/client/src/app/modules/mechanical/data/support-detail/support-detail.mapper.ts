import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { GroupedEstab } from '@core/models/estab.model';
import { SupportMaintenanceDetail } from '@mechanical/domain/models/support-maintenance.model';
import { formatDate } from '@core/utils/date.util';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { mergeMeasureUtil } from '@inventory/utils/merge-measure.util';
import { MedidaProducto } from '@inventory/data/models/measure.model';
import { pricingCalculateUtil } from '@core/utils/pricing-calculate.util';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { roundNumber } from '@core/utils/round-number.utils';
import { isValidField } from '@core/utils/utils';

export class SupportDetailMapper {
  static fromApiGetId(response: ApiResponseLegacy) {
    const result = {
      data: {
        establecimientoId: 0,
        establecimiento: null,
      } as any,
      estabs: [] as GroupedEstab[],
      tarifasImpuesto: [],
      decimal: {} as any,
      details: [] as SupportMaintenanceDetail[],

      feeds: [],
      vehicle: {},
    };
    if (response.code === '1') {
      const {
        bodega,
        support,
        tipoIva,
        decimal,
        supportDetail = [],
        tarifas,
        vehicleDs,
      } = JSON.parse(response.payload as string);
      const { date, nombreComercial, ...dataSupport } = support[0];
      dataSupport.fechaEmision = formatDate(dataSupport.date);
      dataSupport.establecimiento = nombreComercial;
      result.data = dataSupport;
      result.estabs = groupEstabUtil({
        bodegas: bodega,
        isGroupPuntoEmision: false,
        isGroupBodega: true,
      });
      result.tarifasImpuesto = tipoIva;

      result.decimal = decimal[0];

      result.feeds = tarifas;

      result.details = supportDetail.map((item: any) => {
        const { fraccionado, principal, consolidacion, ...restItem } = item;

        let consolidacionesBodega = (consolidacion && JSON.parse(consolidacion)) || [];

        consolidacionesBodega = consolidacionesBodega.map((data: any) => {
          return {
            idArticulo: data.idArticulo,
            idBodega: data.idBodega,
            fechaConsolidacion: data.fechaConsolidacion && new Date(data.fechaConsolidacion),
          };
        });

        const medidas = mergeMeasureUtil(principal, fraccionado);

        const dataMedida =
          medidas.find((m) => m.idMedida === restItem.medidaId) || ({} as MedidaProducto);

        const precioConIva = pricingCalculateUtil.calculatePriceWithVat(
          restItem.price,
          restItem.percentage,
        );
        const precioTotalSinImpuesto = restItem.price * restItem.quantity - restItem.discount;
        const subTotalSinDescuento = restItem.price * restItem.quantity;

        const percentageDiscount =
          subTotalSinDescuento > 0
            ? pricingCalculateUtil.getValueDiscountPercentage(
                subTotalSinDescuento,
                restItem.discount,
              )
            : 0;

        // let taxValue = pricingCalculateUtil.calculateTaxValue(precioTotalSinImpuesto, restItem.percentage)

        const obj: SupportMaintenanceDetail = {
          id: restItem.id,
          rowguid: generateUuidv4(),
          bodegaId: restItem.bodegaId,
          feeId: restItem.tarifaId,
          medidaId: restItem.medidaId,
          productId: restItem.articuloId,
          taxId: restItem.taxId,
          taxPercentId: restItem.taxPercentId,
          quantity: restItem.quantity,
          descripcion: restItem.description,
          codigo: restItem.codigoArticulo,
          cost: restItem.cost,
          taxValue: restItem.taxValue,
          price: restItem.price,
          precioConIva: roundNumber(precioConIva, 4),
          percentageDiscount: roundNumber(percentageDiscount, 4),
          discount: restItem.discount,
          precioTotalSinImpuesto: roundNumber(precioTotalSinImpuesto, 4),
          total: restItem.total,
          obs: isValidField(restItem.obs),
          medidas: medidas || [],
          tarifas: dataMedida.tarifas || [],
          costoFraccionado: dataMedida.precioCostoFraccionado || 0,
          conversion: dataMedida.conversion || 1,
          consolidacionesBodega: consolidacionesBodega,
          llevaInventario: restItem.llevaInventario,
          enabled: restItem.enabled,
        };
        return obj;
      });

      result.vehicle = vehicleDs[0];
    }
    return result;
  }
}
