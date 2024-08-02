import {inject, Injectable} from '@angular/core';
import {PATHS_API} from "@core/constants/global.constants";
import {BILLING_PATHS} from "@billing/enums/billing.enum.ts";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";
import {groupEstabUtil} from "@core/utils/group-estab.util";
import {ApiResponse} from "@core/models/api-response";

@Injectable({
  providedIn: 'root'
})
export class DocElectService {
  private url = `${PATHS_API.FACT_ELECT}${BILLING_PATHS.DOC_ELECT}`
  private http = inject(HttpClient)


  getDataFilter  () {
    let json = JSON.stringify({
      tipo: 2
    })
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`).pipe(
      map(response=>{
        let mainData = JSON.parse(response.payload as string)

        let tempEstabsAndPtosEmision = mainData[0];
        let tiposDoc = mainData[1];
        let estadosDoc = mainData[2];

        let estabs = groupEstabUtil({
          estabs: tempEstabsAndPtosEmision,
          isGroupPuntoEmision: true
        })
        return {
          estabs,
          tiposDoc,
          estadosDoc
        }
      })

    )

  }

}
