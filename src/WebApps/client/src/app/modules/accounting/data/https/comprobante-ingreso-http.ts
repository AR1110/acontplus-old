import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ComprobanteIngresoRepository } from '@accounting/data/repositories/comprobante-ingreso-repository';
import { ACCOUNTING_PATHS } from '@accounting/shared/enums/accounting.constants';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { map } from 'rxjs';
import { ComprobanteIngresoMapper } from '@accounting/data/mappers/comprobante-ingreso-mapper';
import { GroupedEstab } from '@core/models/estab.model';
import { groupEstabUtil } from '@core/utils/group-estab.util';

@Injectable({
  providedIn: 'root',
})
export class ComprobanteIngresoHttp extends ComprobanteIngresoRepository {
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
      .get<ApiResponseLegacy>(`${this._url}?json=${json}` )
      .pipe(
        map((response) => {
          const result = {
            data: [],
          };

          if (response.code === '1') {
            result.data = ComprobanteIngresoMapper.fromApiGetAll(
              JSON.parse(response.payload as string),
            ).data;
          }
          return result;
        }),
      );
  }

  getDataFilter() {
    const json = JSON.stringify({ tipo: 4 });
    return this._http.get<ApiResponseLegacy>(`${this._url}?json=${json}`).pipe(
      map((response) => {
        const result = {
          establecimientos: [] as GroupedEstab[],
          tiposDoc: [],
          subEntidadesFinanciera: [],
          bancos: [],
          users: [],
        };
        if (response.code === '0') {
          return result;
        }

        const { ptoEmision, tipoDocumento, subEntidadFinanciera, banco, users } = JSON.parse(
          response.payload as string,
        );

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

  create<T>(obj: T) {
    const data = ComprobanteIngresoMapper.toApiCreate(obj as any);
    return this._http.post<ApiResponseLegacy>(`${this._url}Insert`, { data });
  }
}
