import { inject, Injectable } from '@angular/core';
import { RetencionAtsRepository } from '@billing/domain/repositories/retencion-ats.repository';
import { map, Observable } from 'rxjs';
import {
  RetencionAts,
  RetencionAtsList,
} from '@billing/domain/models/retencion-ats/retencion-ats.model';
import { PATHS_API } from '@core/constants/global.constants';
import { BILLING_PATHS } from '@billing/domain/enums/billing.enum.ts';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, isApiResponse } from '@core/models/api-response';
import { GroupedEstab } from '@core/models/estab.model';
import { RetAtsDocSustento } from '@billing/domain/models/retencion-ats/ret-ats-doc-sustento.model';

@Injectable({ providedIn: 'root' })
export class RetencionAtsWebRepository implements RetencionAtsRepository {
  private readonly _http = inject(HttpClient);
  private readonly _url = `${PATHS_API.FACT_ELECT}${BILLING_PATHS.RETENCION_ATS}`;

  getAll<T>(parameters: T) {
    return this._http
      .get<ApiResponse>(`${this._url}?json=${JSON.stringify(parameters)}`)
      .pipe(
        map((response) => {
          if (response.code !== '1') {
            return { retenciones: [] };
          }
          const { retenciones } = JSON.parse(response.payload as string);
          return {
            retenciones: retenciones as RetencionAtsList[],
          };
        }),
      );
  }
  getDataForm() {
    const parameters = { tipo: 2 };
    const defaultData = this.getDefaultData();

    return this._http
      .get(`${this._url}?json=${JSON.stringify(parameters)}`)
      .pipe(
        map((response) => {
          if (!isApiResponse(response)) return defaultData;

          try {
            const payload = JSON.parse(response.payload as string);
            return {
              ...defaultData,
              ...payload,
              estabs: payload.estabs as GroupedEstab[],
            };
          } catch (error) {
            console.error('Error parsing response:', error);
            return defaultData;
          }
        }),
      );
  }

  private getDefaultData() {
    return {
      tiposIdentificacion: [],
      tiposIdentificacionProveedor: [],
      tiposComprobante: [],
      sustentosTributarios: [],
      tiposPago: [],
      tiposRegimen: [],
      countries: [],
      paraisosFiscales: [],
      taxes: [],
      tarifaImpuestos: [],
      impuestosRetencion: [],
      porcentajesRetIva: [],
      conceptosRetencionAir: [],
      formasPago: [],
      estabs: [],
      infoAdicional: [],
    };
  }
  getById(id: number): Observable<RetencionAts> {
    throw new Error('Method not implemented.');
  }
  create<T>(data: T): Observable<ApiResponse> {
    console.log(data);
    return this._http
      .post<ApiResponse>(`${this._url}`, { data })
      .pipe(map((response) => response));
  }
  update(data: any): Observable<RetencionAts> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Observable<RetencionAts> {
    throw new Error('Method not implemented.');
  }
  getDocs<T extends { idCard: string }>(parameters: T) {
    const obj = {
      ...parameters,
      tipo: 4,
    };

    return this._http
      .get<ApiResponse>(`${this._url}?json=${JSON.stringify(obj)}`)
      .pipe(
        map((response) => {
          if (response.code !== '1') {
            return { documents: [] };
          }
          const { documents } = JSON.parse(response.payload as string);

          return { documents: documents as RetAtsDocSustento[] };
        }),
      );
  }
}
