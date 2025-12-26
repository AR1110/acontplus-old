import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { formatDate } from '@core/utils/date.util';
import { mergeMeasureUtil } from '@inventory/utils/merge-measure.util';
import { MedidaProducto } from '@inventory/data/models/measure.model';
import { pricingCalculateUtil } from '@core/utils/pricing-calculate.util';
import { SupportDetail } from '@mechanical/domain/models/support.model';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { roundNumber } from '@core/utils/round-number.utils';
import { isValidField } from '@core/utils/utils';

export class SupportMapper {
  static fromApiGetAll(response: ApiResponseLegacy) {
    let results = [];
    if (response.code === '1') {
      const { supports } = JSON.parse(response.payload as string);

      results = supports.map((item: any, index: number) => {
        return {
          position: index + 1,
          id: item.id,
          sequence: item.sequence,
          fechaEmision: item.date,
          idCard: item.idCard,
          tradeName: item.tradeName,
          licensePlate: item.licensePlate,
          status: item.status,
          colorRow: item.colorRow,
          userAssigned: item.userAssigned,
          totalRecords: item.totalRecords,
          obs: item.obs,
          codEstab: item.codEstab,
          typeStatus: item.typeStatus,
          existsInsp: item.existsInsp,
        };
      });
    }
    return results;
  }

  static fromApiFilter(response: ApiResponseLegacy) {
    const data = {
      supportStatus: [] as any[],
    };
    if (response.code === '1') {
      const { supportStatus } = JSON.parse(response.payload as string);

      data.supportStatus = supportStatus;
    }
    return data;
  }

  static fromApiDashboard(response: ApiResponseLegacy) {
    const result = {
      data: {
        quantitySupport: 0,
        quantityVehicleCompany: 0,
        quantityInspection: 0,
      },
      barchart: [] as any,
    };
    if (response.code === '1') {
      const mainData = JSON.parse(response.payload as string);

      const quantity = mainData.quantity[0];
      result.data = {
        quantitySupport: quantity.quantitySupport,
        quantityVehicleCompany: quantity.quantityVehicleCompany,
        quantityInspection: quantity.quantityInspection,
      };
      result.barchart = mainData.barchart || [];
    }
    return result;
  }

  static fromApiGetId(response: ApiResponseLegacy) {
    const result = {
      data: {},
      vehicle: {},
      customer: {
        tradeName: '',
      },
    };
    if (response.code === '1') {
      const { support, paramaters, vehicle, customer } = JSON.parse(response.payload as string);
      const mainData = support[0];
      const pr = paramaters[0];

      result.data = {
        id: mainData.id,
        establecimientoId: pr.establecimientoId,
        puntoEmisionId: mainData.puntoEmisionId,
        vehicleCompanyId: mainData.vehicleCompanyId,
        customerId: mainData.customerId,
        userAssignedId: mainData.userAssignedId,
        fechaEmision: formatDate(mainData.date),
        fechaEmisionDocCreado: formatDate(mainData.date),
        obs: mainData.obs,
        status: mainData.status,
        sequence: pr.sequence,
      };

      result.vehicle = vehicle[0];
      result.customer = customer[0];
    }
    return result;
  }

  static fromApiDataForm(response: ApiResponseLegacy) {
    const result = {
      establishments: [],
      emissionPoints: [],
      users: [],
    };
    if (response.code === '1') {
      const { establishments, emissionPoints, users } = JSON.parse(response.payload as string);
      result.establishments = establishments;
      result.emissionPoints = emissionPoints;
      result.users = users;
    }

    return result;
  }

  static fromApiSearch(response: ApiResponseLegacy) {
    let results = [];
    if (response.code === '1') {
      const { dataSearch } = JSON.parse(response.payload as string);
      results = dataSearch.map((item: any) => {
        return {
          id: item.id,
          licensePlate: item.licensePlate,
          brand: item.brand,
          tradeName: item.tradeName,
        };
      });
      console.log(results);
    }
    return results;
  }

  static fromApiGetAprobacion(response: ApiResponseLegacy) {
    const {
      comprobante: tempComprobante,

      cliente,
      config,
      detalle,
      formapago,
      tiempoCredito,
      impuestos,
      vehicle,
      inspection,
    } = JSON.parse(response.payload as any);

    const details = detalle.map((item: any) => {
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
          ? pricingCalculateUtil.getValueDiscountPercentage(subTotalSinDescuento, restItem.discount)
          : 0;

      const obj: SupportDetail = {
        id: restItem.id,
        rowguid: generateUuidv4(),
        bodegaId: restItem.bodegaId,
        feeId: restItem.tarifaId,
        medidaId: restItem.medidaId,
        productId: restItem.articuloId,
        taxId: restItem.taxId,
        idImpuesto: restItem.idImpuesto,
        idTipoIva: restItem.idTipoIva,
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
        codePercentage: restItem.codePercentage,
        percentage: restItem.percentage,
        precioSinSubsidio: restItem.precioSinSubsidio || 0,
      };
      return obj;
    });
    const comprobante = tempComprobante[0];
    const formasPagoSri = formapago;

    return {
      comprobante,
      details,
      companyCustomer: cliente[0],
      formasPagoSri,
      tiemposCredito: tiempoCredito,
      config: config[0],
      taxPercents: impuestos,
      inspection: inspection || [],
      vehicle: vehicle || [],
    };
  }

  static fromApiDocView(response: ApiResponseLegacy) {
    let result = {} as any;
    if (response.code === '1') {
      const { comprobante } = JSON.parse(response.payload as string);
      const mainData = comprobante[0];
      result = mainData;
    }
    return result;
  }
}
