import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { formatDate } from '@core/utils/date.util';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { pricingCalculateUtil } from '@core/utils/pricing-calculate.util';
import { roundNumber } from '@core/utils/round-number.utils';
import { isValidField } from '@core/utils/utils';
import { MedidaProducto } from '@inventory/core/domain/measure.model';
import { mergeMeasureUtil } from '@inventory/utils/merge-measure.util';
import { map } from 'rxjs';

import { MECHANICAL_PATHS } from '@mechanical/domain/enums/mechanical.enum';
import { SupportDetail } from '@mechanical/domain/models/support.model';

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  #url = `${PATHS_API.MECHANICAL}${MECHANICAL_PATHS.SUPPORT}`
  #http = inject(HttpClient)


  getAll<T>(obj: T) {
    let json = JSON.stringify({
      ...obj,
      tipo: 1
    })
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response: any) => {
        let results = [];
        if (response !== null && typeof response === 'object') {
          let mainData = response.supports;

          results = mainData.map((item: any, index: number) => {
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
              existsInsp : item.existsInsp

            }
          })
        }
        return results;
      })
    )
  }

  getDataFilter(){
    let json = JSON.stringify({
      tipo: 8
    })
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response: any) => {
        return response.supportStatus;
      })
    )
  }

  getDataForm() {
    let json = JSON.stringify({
      tipo: 2
    })
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response: any) => {
        return {
          establishments: response.establishments,
          emissionPoints: response.emissionPoints,
          users: response.users
        }
      })
    )
  }

  getId(id: number) {
    let json = JSON.stringify({
      id,
      tipo: 3
    })
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response: any) => {
        let result = {
          data: {},
          vehicle: {},
          customer: {
            tradeName: ''
          }
        };
        if (response !== null && typeof response === 'object') {
          let mainData = response.support[0];
          let paramaters = response.paramaters[0]

          result.data = {
            id: mainData.id,
            establecimientoId: paramaters.establecimientoId,
            puntoEmisionId: mainData.puntoEmisionId,
            vehicleCompanyId: mainData.vehicleCompanyId,
            customerId: mainData.customerId,
            userAssignedId: mainData.userAssignedId,
            fechaEmision: formatDate(mainData.date),
            fechaEmisionDocCreado: formatDate(mainData.date),
            obs: mainData.obs,
            status: mainData.status,
            sequence: paramaters.sequence
          }

          result.vehicle = response.vehicle[0];
          result.customer = response.customer[0]
        }
        return result;
      })
    )
  }

  getDashboard(){
    let json = JSON.stringify({
      tipo: 6
    })
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response: any) => {

        let result = {
          data: {
            quantitySupport: 0,
            quantityVehicleCompany: 0,
            quantityInspection:0,
          },
          barchart: [] as any
        }
        if(response!==null && typeof response==='object'){

          let quantity = response.quantity[0];
          result.data = {
            quantitySupport: quantity.quantitySupport,
            quantityVehicleCompany: quantity.quantityVehicleCompany,
            quantityInspection: quantity.quantityInspection,
          }
          result.barchart = response.barchart;
        }
        return result;
      })
    )
  }

  getConvertToAprobDoc(id:number){
    let json = JSON.stringify({
      tipo: 5,
      id
    })
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response: any) => {
        const { cliente, config, detalle, formapago, tiempoCredito, impuestos ,vehicle ,inspection} = response;

        let details = detalle.map((item: any) => {

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


          const medidas = mergeMeasureUtil(principal, fraccionado);

          let dataMedida = medidas.find((m) => m.idMedida === restItem.medidaId) || ({} as MedidaProducto);

          let precioConIva = pricingCalculateUtil.calculatePriceWithVat(restItem.price, restItem.percentage);
          let precioTotalSinImpuesto = restItem.price * restItem.quantity - restItem.discount;
          let subTotalSinDescuento = restItem.price * restItem.quantity

          let percentageDiscount = subTotalSinDescuento > 0 ? pricingCalculateUtil.getValueDiscountPercentage(subTotalSinDescuento,
            restItem.discount
          ) : 0


          let obj: SupportDetail = {
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
            precioSinSubsidio: restItem.precioSinSubsidio||0
          };
          return obj;
        }
        );

        let tempComprobante = response.comprobante[0];
        let comprobante = tempComprobante;
        let formasPagoSri = formapago;

        return {
          comprobante,
          details,
          companyCustomer: cliente[0],
          formasPagoSri,
          tiemposCredito: tiempoCredito,
          config: config[0],
          taxPercents: impuestos,
          inspection : inspection,
          vehicle : vehicle
        }
      }))
  }

  getDocView(id:number){
    let json = JSON.stringify({
      tipo: 7,
      id
    })
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response:any)=>{
        let result = {} as any;
        if(response!==null && typeof response==='object'){
          let mainData = response.comprobante[0];
          result = mainData;
        }
        return result;
      })
    )
  }

  searchCustomerVehicle<T extends { textSearch: string }>(obj: T) {
    let json = JSON.stringify({
      tipo: 4,
      textSearch: obj.textSearch
    })
    return this.#http.get(`${this.#url}?json=${json}`,{
      context: getNoLoader()
    }).pipe(
      map((response: any) => {
        let results = [];
        if (response !== null && typeof response === 'object') {
          results = response.dataSearch;
        }
        return results;
      })
    )
  }

  post<T>(data: T) {
    return this.#http.post(`${this.#url}`, { data })
  }

  put<T>(id: number, data: T) {
    return this.#http.put(`${this.#url}${id}`, { data })
  }

  remove(id:number){
    return this.#http.delete(`${this.#url}${id}`)
  }

  putState(id: number, supportStatusId: number) {
    return this.#http.put(`${this.#url}PutState/${id}/${supportStatusId}`, null)
  }


}
