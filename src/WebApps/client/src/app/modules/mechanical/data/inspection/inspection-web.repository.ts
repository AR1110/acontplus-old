import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { formatDate } from '@core/utils/date.util';
import { isValidJSON } from '@core/utils/utils';
import { map } from 'rxjs';
import { ApiResponse } from "@core/models/api-response";
import { MECHANICAL_PATHS } from '@mechanical/domain/enums/mechanical.enum';
import { VehiclePart } from '@mechanical/domain/models/vehicle-part';
import { VehiclePartType } from '@mechanical/domain/models/vehicle-part-type';
import {InspectionRepository} from "@mechanical/domain/repositories/inspection.repository";

@Injectable({
  providedIn: 'root'
})
export class InspectionWebRepository implements InspectionRepository{
  #url = `${PATHS_API.MECHANICAL}${MECHANICAL_PATHS.INSPECTION}`;
  #http = inject(HttpClient);

  getAll<T>(obj: T) {
    let json = JSON.stringify({
      ...obj,
      tipo: 1
    })
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response: any) => {
        let results: any = [];
        if (response !== null && typeof response === 'object') {
          results = response.inspection

        }
        return results;
      })
    )
  }

  getDataForm(supportId: number) {
    let json = JSON.stringify({
      supportId,
      tipo: 2
    })
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response: any) => {
        let result = {
          support: {} as any,
          data: {},
          vehicleParts: [] as VehiclePart[],
          vehiclePartTypes: [] as VehiclePartType[]
        }

        if (response !== null && typeof response === 'object') {
          const { support, vehiclePart, vehiclePartType } = response;
          result.support = support[0];

          result.vehicleParts = vehiclePart;
          result.vehiclePartTypes = vehiclePartType;


        }
        return result;
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
          data: {} as any,
          vehicleParts: [] as VehiclePart[],
        }

        if (response !== null && typeof response === 'object') {
          const { inspection } = response;
          let mainData = inspection[0];

          result.data = {
            id: mainData.id,
            fechaEmision: formatDate(mainData.date),
            mileage: mainData.mileage,
            fuelLevel: mainData.fuelLevel,
            obs: mainData.obs,
            fechaEmisionDocCreado: formatDate(mainData.date)
          }

          let vehicleParts: any[] = [];

          // Recorre cada propiedad del objeto data
          for (const key in mainData) {
            let value = mainData[key]
            if (typeof value === 'string' && isValidJSON(value)) {

              const parsedArray = JSON.parse(value);
              if (Array.isArray(parsedArray)) {
                // Agrega los objetos del array a parsedData

                vehicleParts = [...vehicleParts, ...parsedArray]

              }
            }
          }

          result.vehicleParts = vehicleParts;



        }
        return result;
      })
    )
  }

  post<T>(data: T) {
    return this.#http.post<ApiResponse>(`${this.#url}`, { data })
  }

  put<T>(id: number, data: T) {
    return this.#http.put<ApiResponse>(`${this.#url}${id}`, { data })
  }

  remove(id: number) {
    return this.#http.delete<ApiResponse>(`${this.#url}${id}`)
  }

}
