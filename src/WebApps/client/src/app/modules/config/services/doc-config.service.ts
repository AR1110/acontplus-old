import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { CONFIG_PATHS } from '../enums/config.enums';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { ApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class DocConfigService {
  #url = `${PATHS_API.CONFIG}${CONFIG_PATHS.DOC_CONFIG}`;
  #http = inject(HttpClient);

  get<T>(params: T) {
    return this.#http
      .get(`${this.#url}?json=${JSON.stringify(params)}`)
      .pipe(map((response) => response));
  }

  getInfoAdicional(id: number) {
    let json = JSON.stringify({
      tipo: 3,
      id,
    });
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response: any) => { 
        let infoAdicional = [];
        if(response && typeof response==='object'){
          let [mainData ]= response.infoAdicional;
          infoAdicional = JSON.parse(mainData.infoAdicional);
        }
       
        return {
          infoAdicional
        };
      }),
    );
  }


  getDataForm() {
    return this.#http
      .get(`${this.#url}?json=${JSON.stringify({ tipo: 2 })}`)
      .pipe(
        map((response: any) => {
          const { estabs, tiposDoc } = response;

          return {
            establecimientos: groupEstabUtil({
              estabs,
              isGroupPuntoEmision: true,
            }),
            tiposDoc,
          };
        }),
      );
  }

  getAll(idPuntoEmision: number) {
    let json = JSON.stringify({
      tipo: 1,
      idPuntoEmision,
    });
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response: any) => {
        let mainData = response.docs;
        return mainData;
      }),
    );
  }

  post<T>(obj: T) {
    let data = {
      docs: JSON.stringify(obj)
     }
    return this.#http
      .post<ApiResponse>(`${this.#url}`, { data })
      .pipe(map((response) => response));
  }
}
