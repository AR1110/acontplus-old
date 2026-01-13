import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { CONFIG_PATHS } from '@modules/config/domain/enums/config.enums';
import { HttpClient } from '@angular/common/http';
import { DocConfigRepository } from '@modules/config/domain/repositories/doc-config.repository';
import {
  DocConfigFormDataResponse, 
  DocConfigListResponse,
  DocConfig, DocConfigInfoAdicionalList,
} from '@modules/config/domain/models/doc-config.model';
import { map, Observable } from 'rxjs';
import { DocConfigListMapper } from '@modules/config/data/doc-config/doc-config-list.mapper';
import { DocConfigInfoAdicionalesMapper } from '@modules/config/data/doc-config/doc-config-info-adicionales.mapper';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { groupEstabUtil } from '@core/utils/group-estab.util';

@Injectable({
  providedIn: 'root',
})
export class DocConfigRepositoryImpl implements DocConfigRepository {
  getFormData(): Observable<DocConfigFormDataResponse> {
    return this.#http.get(`${this.#url}?json=${JSON.stringify({ tipo: 2 })}`).pipe(
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

  create(params: any): Observable<ApiResponseLegacy> {
    const data = {
      docs: JSON.stringify(params),
    };
    return this.#http.post<ApiResponseLegacy>(`${this.#url}`, { data });
  }

  save(docConfig: DocConfig): Observable<ApiResponseLegacy> {
    const data = {
      docs: JSON.stringify(docConfig),
    };
    return this.#http.post<ApiResponseLegacy>(`${this.#url}`, { data });
  }
  getInfoAdicionales(id: number): Observable<DocConfigInfoAdicionalList[]> {
    const json = DocConfigInfoAdicionalesMapper.toJson(id);
    return this.#http
      .get(`${this.#url}?json=${json}`)
      .pipe(map((response) => DocConfigInfoAdicionalesMapper.fromJson(response)));
  }
  list(puntoEmisionId: number): Observable<DocConfigListResponse> {
    const json = DocConfigListMapper.toJson(puntoEmisionId);
    return this.#http
      .get(`${this.#url}?json=${json}`)
      .pipe(map((response) => DocConfigListMapper.fromJson(response)));
  }

  #url = `${PATHS_API.CONFIG}${CONFIG_PATHS.DOC_CONFIG}`;
  #http = inject(HttpClient);
}
