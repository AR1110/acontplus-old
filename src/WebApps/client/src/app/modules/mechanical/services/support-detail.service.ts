import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { GroupedEstab } from '@core/models/estab.model';
import { formatDate } from '@core/utils/date.util';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { map } from 'rxjs';

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
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response: any) => {
        let result = {
          data: {
            establecimientoId: 0
          } as any,
          estabs: [] as GroupedEstab[],
          tarifasImpuesto: [],
            decimal: {} as any,
        }
        if (response !== null && typeof response === 'object') {
          let { bodega, support, tipoIva, decimal } = response;
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
        }
        return result;
      })
    )
  }

}
