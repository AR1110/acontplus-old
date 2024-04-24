import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { MECHANICAL_PATHS } from '../enums/mechanical.enum';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  #url = `${PATHS_API.MECHANICAL}${MECHANICAL_PATHS.SUPPORT}`
  #http = inject(HttpClient)



  getDataForm(){
    let json = JSON.stringify({
      tipo: 2
    })
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response:any)=>{
        return {
          establishments: response.establishments,
          emissionPoints: response.emissionPoints,
          users: response.users
        }
      })
    )
  }

  searchCustomerVehicle<T extends { textSearch: string }>(obj: T){
    let json = JSON.stringify({
      tipo: 4,
      textSearch: obj.textSearch
    })
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response: any) => {
        console.log(response)
        return response;
      })
    )
  }


}
