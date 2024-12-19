
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { MECHANICAL_PATHS } from '@mechanical/domain/enums/mechanical.enum';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  #url = `${PATHS_API.MECHANICAL}${MECHANICAL_PATHS.VEHICLE}`
  #http = inject(HttpClient);

  getAll<T>(obj: T) {
    let json = JSON.stringify({
      ...obj,
      tipo: 1
    })
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response: any) => {
        let vehicles = [];
        if (response !== null && typeof response === 'object') {
          let data = response.vehicles;
          vehicles = data.map((item: any, index: number) => {
            return {
              ...item,
              position: index + 1
            }
          });
        }
        return vehicles;
      })
    )
  }

  getDataForm() {
    let json = JSON.stringify({
      tipo: 2
    })
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response: any) => {
        let data = {
          countries: [],
          vehicleTypes: []
        }
        if (response !== null && typeof response === 'object') {
          data.countries = response.countrys;
          data.vehicleTypes = response.vehicleTypes;
        }
        return data;
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
        let data = {
          customer: {

            businessName: null,
            id: 0
          },
          vehicle: {}
        }
        if (response !== null && typeof response === 'object') {
          data.customer = response.customer[0];
          data.vehicle = response.vehicle[0]
        }
        return data;
      })
    )
  }


  post<T>(data: T) {
    return this.#http.post(`${this.#url}`, { data })
  }

  put<T>(id: number, data: T) {
    return this.#http.put(`${this.#url}${id}`, { data })
  }

  remove(id: number) {
    return this.#http.delete(`${this.#url}${id}`)
  }

  putState(id: number, state: boolean) {
    return this.#http.put(`${this.#url}PutState/${id}/${state}`, null)
  }

}
