import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';

import { MECHANICAL_PATHS } from '../enums/mechanical.enum';

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
    return this.#http.get(`${this.#url}?json=${json}`)
  }

}
