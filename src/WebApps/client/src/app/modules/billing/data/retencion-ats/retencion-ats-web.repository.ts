import { inject, Injectable } from '@angular/core';
import { RetencionAtsRepository } from '@billing/domain/repositories/retencion-ats.repository';
import { map, Observable } from 'rxjs';
import {
  RetencionAts,
  RetencionAtsList,
} from '@billing/domain/models/retencion-ats.model';
import { PATHS_API } from '@core/constants/global.constants';
import { BILLING_PATHS } from '@billing/domain/enums/billing.enum.ts';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/api-response';

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
        })
      );
  }
  getById(id: number): Observable<RetencionAts> {
    throw new Error('Method not implemented.');
  }
  create(data: any): Observable<RetencionAts> {
    throw new Error('Method not implemented.');
  }
  update(data: any): Observable<RetencionAts> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Observable<RetencionAts> {
    throw new Error('Method not implemented.');
  }
}
