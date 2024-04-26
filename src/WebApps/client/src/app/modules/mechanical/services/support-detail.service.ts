import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { GroupedEstab } from '@core/models/estab.model';
import { formatDate } from '@core/utils/date.util';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { map } from 'rxjs';

import { MECHANICAL_PATHS } from '../enums/mechanical.enum';
import { SupportMaintenanceDetail } from '../models/support-maintenance.model';
import { mergeMeasureUtil } from '@modules/inventory/utils/merge-measure.util';
import { MedidaProducto } from '@modules/inventory/shared/models/measure.model';
import { pricingCalculateUtil } from '@core/utils/pricing-calculate.util';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { roundNumber } from '@core/utils/round-number.utils';
import { isValidField } from '@core/utils/utils';

@Injectable({
  providedIn: 'root'
})
export class SupportDetailService {
  #url = `${PATHS_API.MECHANICAL}${MECHANICAL_PATHS.SUPPORT_DETAIL}`
  #http = inject(HttpClient)


  getId(id: number) {
    let json = JSON.stringify({
      tipo: 1, id
    })
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response: any) => {
        let result = {
          data: {
            establecimientoId: 0
          } as any,
          estabs: [] as GroupedEstab[],
          tarifasImpuesto: [],
          decimal: {} as any,
          details: [] as SupportMaintenanceDetail[]
        }
        if (response !== null && typeof response === 'object') {
          let { bodega, support, tipoIva, decimal, supportDetail } = response;
          let { date, ...dataSupport } = support[0]
          dataSupport.fechaEmision = formatDate(dataSupport.date)
          result.data = dataSupport;
          result.estabs = groupEstabUtil({
            bodegas: bodega,
            isGroupPuntoEmision: false,
            isGroupBodega: true,
          });
          result.tarifasImpuesto = tipoIva;

          result.decimal = decimal[0];


          result.details = supportDetail.map((item: any) => {

            const { fraccionado, principal, consolidacion, ...restItem } = item;

            let consolidacionesBodega = (consolidacion && JSON.parse(consolidacion)) || [];

            consolidacionesBodega = consolidacionesBodega.map((data: any) => {

              return {
                idArticulo: data.idArticulo,
                idBodega: data.idBodega,
                fechaConsolidacion:
                  data.fechaConsolidacion &&
                  new Date(data.fechaConsolidacion),
              }
            })

            let dataTarifaImpuesto = tipoIva.find((ti: any) => ti.codigo === restItem.codePercentage);

            const medidas = mergeMeasureUtil(principal, fraccionado);

            let dataMedida = medidas.find((m) => m.idMedida === restItem.medidaId) || ({} as MedidaProducto);

            let precioConIva = pricingCalculateUtil.calculatePriceWithVat(restItem.price, restItem.percentage);
            let precioTotalSinImpuesto = restItem.price * restItem.quantity - restItem.valorDescuento;
            let subTotalSinDescuento = restItem.price * restItem.quantity

            let percentageDiscount = subTotalSinDescuento > 0 ? pricingCalculateUtil.getValueDiscountPercentage(subTotalSinDescuento,
              restItem.valorDescuento
            ) : 0

            let taxValue = pricingCalculateUtil.calculateTaxValue(precioTotalSinImpuesto, restItem.percentage)

            let obj: SupportMaintenanceDetail = {
              id: restItem.id,
              rowguid: generateUuidv4(),
              bodegaId: restItem.bodegaId,
              feeId: restItem.tarifaId,
              medidaId: restItem.medidaId,
              productId: restItem.articuloId,
              taxId: dataTarifaImpuesto.idImpuesto,
              taxPercentId: dataTarifaImpuesto.idTarifaImpuesto,
              quantity: restItem.quantity,
              descripcion: restItem.description,
              codigo: restItem.codigoArticulo,
              cost: restItem.cost,
              taxValue: taxValue,
              price: restItem.price,
              precioConIva: roundNumber(precioConIva, 4),
              percentageDiscount: roundNumber(percentageDiscount, 4),
              discount: restItem.valorDescuento,
              precioTotalSinImpuesto: roundNumber(precioTotalSinImpuesto, 4),
              total: restItem.total,
              obs: isValidField(restItem.obs),
              medidas: medidas || [],
              tarifas: dataMedida.tarifas || [],
              costoFraccionado: dataMedida.precioCostoFraccionado || 0,
              conversion: dataMedida.conversion || 1,
              consolidacionesBodega: consolidacionesBodega,
              llevaInventario: restItem.llevaInventario,
              estado: true
            };
            return obj;
          }
          );






        }
        return result;
      })
    )
  }


  post<T>(data: T) {
    return this.#http.post(`${this.#url}`, { data })
  }

}
