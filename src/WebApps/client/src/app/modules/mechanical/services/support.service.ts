import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { MECHANICAL_PATHS } from '../enums/mechanical.enum';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { formatDate } from '@core/utils/date.util';

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

            }
          })
        }
        return results;
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

  searchCustomerVehicle<T extends { textSearch: string }>(obj: T) {
    let json = JSON.stringify({
      tipo: 4,
      textSearch: obj.textSearch
    })
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
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

}
