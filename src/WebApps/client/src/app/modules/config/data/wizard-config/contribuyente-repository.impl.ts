import { Injectable, inject } from '@angular/core';
import { ContribuyenteRepository } from '@modules/config/data/repositories/contribuyente.repository';
import { Contribuyente } from '@modules/config/data/models/wizard-config/contribuyente.model';
import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { HttpClient } from '@angular/common/http';
import { PATHS_API } from '@core/constants/global.constants';
import { CONFIG_PATHS } from '@modules/config/config-const';

@Injectable({ providedIn: 'root' })
export class ContribuyenteRepositoryImpl implements ContribuyenteRepository {
  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.CONTRIBUYENTE}`;
  private _http = inject(HttpClient);

  save(contribuyente: Contribuyente): Observable<ApiResponseLegacy> {
    return this._http.post<ApiResponseLegacy>(`${this._url}/save`, contribuyente);
  }
}
