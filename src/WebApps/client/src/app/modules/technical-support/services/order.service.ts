import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response';
import { GroupedEstab } from '@core/models/estab.model';
import { formatDate } from '@core/utils/date.util';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { pricingCalculateUtil } from '@core/utils/pricing-calculate.util';
import { roundNumber } from '@core/utils/round-number.utils';
import { isValidField } from '@core/utils/utils';
import { MedidaProducto } from '@modules/inventory/shared/models/measure.model';
import { mergeMeasureUtil } from '@modules/inventory/utils/merge-measure.util';
import { map } from 'rxjs';

import { TECH_SUPPORT_PATHS } from '../constants/tech-support.constants';
import { OrderMaintenance } from '../models/order-maintenance.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  url = `${PATHS_API.TECHSUPPORT}${TECH_SUPPORT_PATHS.ORDER}`;
  private http = inject(HttpClient);
  delete(id: number) {
    return this.http
      .delete(`${this.url}${id}`)
      .pipe(map((response) => response));
  }
  delivery(id: number, data: any) {
    return this.http
      .put(`${this.url}delivery/${id}`, data)
      .pipe(map((response) => response));
  }

  getAll<T>(obj: T) {
    let json = JSON.stringify({
      ...obj,
      tipo: 2,
    });
    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response) => {
        let orders = [];
        if (isApiResponse(response)) {
          if (response.code === '1') {
            let mainData = JSON.parse(response.payload as string);

            orders = mainData.orders.map((item: any, index: number) => {
              return {
                ...item,
                position: index + 1,
              };
            });
          }
        }
        return orders;
      })
    );
  }

  getId(id: number) {
    let json = JSON.stringify({
      id,
      tipo: 4,
    });
    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response) => {
        let data = {
          order: {} as any,
          establecimientos: [] as Array<GroupedEstab>,
          orderMaintenances: [] as any,
          orderDetails: [] as any,
          feeds: [] as any,
          taxes: [] as any[],
          taxPercents: [] as any[],
          decimal: {} as any,
        };
        if (isApiResponse(response)) {
          if (response.code === '1') {
            let {
              order,
              orderDetails,
              orderMaintenances,
              estabs,
              bodegas,
              feeds,
              taxes,
              taxPercents,
              decimalsConfig,
            } = JSON.parse(response.payload as string);

            let tempOrder = order[0];
            data.order = {
              ...tempOrder,
              fechaEmision: formatDate(tempOrder.fechaEmision),
              fechaEmisionDocCreado: formatDate(tempOrder.fechaEmision),
            };
            data.orderDetails = orderDetails;
            if (orderMaintenances) {
              data.orderMaintenances = orderMaintenances.map(
                (item: any, index: number) => {
                  const { fraccionado, principal, consolidacion, ...restItem } =
                    item;

                  let consolidacionesBodega =
                    (consolidacion && JSON.parse(consolidacion)) || [];
                  consolidacionesBodega = consolidacionesBodega.map(
                    (data: any) => ({
                      idArticulo: data.idArticulo,
                      idBodega: data.idBodega,
                      fechaConsolidacion:
                        data.fechaConsolidacion &&
                        new Date(data.fechaConsolidacion),
                    })
                  );

                  const medidas = mergeMeasureUtil(principal, fraccionado);

                  let dataMedida =
                    medidas.find((m) => m.idMedida === restItem.medidaId) ||
                    ({} as MedidaProducto);

                  let precioConIva = pricingCalculateUtil.calculatePriceWithVat(
                    restItem.price,
                    restItem.taxPercentage
                  );
                  let precioTotalSinImpuesto =
                    restItem.price * restItem.quantity - restItem.discount;
                  let subTotalSinDescuento = restItem.price * restItem.quantity;
                  let percentageDiscount =
                    subTotalSinDescuento > 0
                      ? pricingCalculateUtil.getValueDiscountPercentage(
                          subTotalSinDescuento,
                          restItem.discount
                        )
                      : 0;

                  let obj: OrderMaintenance = {
                    id: restItem.id,
                    rowguid: generateUuidv4(),
                    bodegaId: restItem.bodegaId,
                    feeId: restItem.feeId,
                    medidaId: restItem.medidaId,
                    orderDetailId: restItem.orderDetailId,
                    productId: restItem.productId,
                    taxId: restItem.taxId,
                    taxPercentId: restItem.taxPercentId,
                    quantity: restItem.quantity,
                    descripcion: restItem.descripcion,
                    codigo: restItem.codigo,
                    cost: restItem.cost,
                    taxValue: restItem.taxValue,
                    price: restItem.price,
                    precioConIva: roundNumber(precioConIva, 4),
                    percentageDiscount: roundNumber(percentageDiscount, 4),
                    discount: restItem.discount,
                    precioTotalSinImpuesto: roundNumber(
                      precioTotalSinImpuesto,
                      4
                    ),
                    total: restItem.total,
                    obs: isValidField(restItem.obs),
                    medidas: medidas || [],
                    tarifas: dataMedida.tarifas || [],
                    costoFraccionado: dataMedida.precioCostoFraccionado || 0,
                    conversion: dataMedida.conversion || 1,
                    consolidacionesBodega: consolidacionesBodega,
                    llevaInventario: restItem.llevaInventario,
                  };
                  return obj;
                }
              );
            }

            data.feeds = feeds;
            data.taxes = taxes;
            data.taxPercents = taxPercents;
            data.establecimientos = groupEstabUtil({
              estabs,
              bodegas,
              isGroupPuntoEmision: true,
              isGroupBodega: true,
            });

            data.decimal = decimalsConfig[0];
          }
        }
        return data;
      })
    );
  }

  get<T>(params: T) {
    return this.http
      .get(`${this.url}?json=${JSON.stringify(params)}`)
      .pipe(map((response) => response));
  }

  convert(data: any) {
    return this.http
      .post(`${this.url}Convert`, data)
      .pipe(map((response) => response));
  }

  post(data: any) {
    return this.http
      .post(`${this.url}`, data)
      .pipe(map((response) => response));
  }
  put(id: number, data: any) {
    return this.http
      .put(`${this.url}${id}`, data)
      .pipe(map((response) => response));
  }
}
