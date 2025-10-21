import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ComprobanteIngresoRepository } from '@accounting/comprobante-ingreso/domain/comprobante-ingreso.repository';
import { ACCOUNTING_PATHS } from '@accounting/shared/enums/accounting.constants';
import { ApiResponse } from '@core/models/api-response';
import { map } from 'rxjs';
import { ComprobanteIngresoMapper } from '@accounting/comprobante-ingreso/infrastructure/comprobante-ingreso.mapper';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { GroupedEstab } from '@core/models/estab.model';
import { groupEstabUtil } from '@core/utils/group-estab.util';

@Injectable({
  providedIn: 'root',
})
export class ComprobanteIngresoWebRepository extends ComprobanteIngresoRepository {
  private _url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.COMPROBANTE_INGRESO}`;
  private _http = inject(HttpClient);

  constructor() {
    super();
  }

  getAll<T>(obj: T) {
    const json = JSON.stringify({
      tipo: 1,
      ...obj,
    });
    return this._http
      .get<ApiResponse>(`${this._url}?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(
        map(response => {
          const result = {
            establecimientos: [] as GroupedEstab[],
            tiposDoc :[],
            subEntidadesFinanciera:[],
            bancos :[],
            users: []
          }
          if(response.code==="0") {
            return result;
          }

          const { ptoEmision, tipoDocumento, subEntidadFinanciera, banco, users } = JSON.parse(response.payload as string);

          result.establecimientos = groupEstabUtil({
            estabs: ptoEmision,
            isGroupPuntoEmision: true,
          });


          result.tiposDoc = tipoDocumento;
          result.subEntidadesFinanciera = subEntidadFinanciera;
          result.bancos = banco;
          result.users = users;
          return result;
        }),
      );
  }

  getDataFilter() {
    const json = JSON.stringify({ tipo: 4 });
    return this._http.get<ApiResponse>(`${this._url}?json=${json}`).pipe(
      map(response => {
        const result = {
          establecimientos: [] as GroupedEstab[],
          tiposDoc: [],
          subEntidadesFinanciera: [],
          bancos: [],
        };
        if (response.code === '0') {
          return result;
        }

        const { ptoEmision, tipoDocumento, subEntidadFinanciera, banco } = JSON.parse(
          response.payload as string,
        );

        result.establecimientos = groupEstabUtil({
          estabs: ptoEmision,
          isGroupPuntoEmision: true,
        });

        result.tiposDoc = tipoDocumento;
        result.subEntidadesFinanciera = subEntidadFinanciera;
        result.bancos = banco;
        return result;
      }),
    );
  }

  create<T>(obj: T) {
    const data = ComprobanteIngresoMapper.toApiCreate(obj as any);
    return this._http.post<ApiResponse>(`${this._url}Insert`, { data });
  }
}
