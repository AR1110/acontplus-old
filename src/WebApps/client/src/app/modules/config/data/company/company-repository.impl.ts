import { inject, Injectable, OnInit } from '@angular/core';
import { CompanyRepository } from '@modules/config/data/repositories/company.repository';
import { HttpClient } from '@angular/common/http';
import { PATHS_API, SEPARADORES_REGEX } from '@core/constants/global.constants';
import { CONFIG_PATHS } from '@modules/config/config-const';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ListCompanyResponse, CompanyList } from '@modules/config/data/models/company.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyRepositoryImpl implements CompanyRepository {
  list(): Observable<ListCompanyResponse> {
    const json = JSON.stringify({
      tipo: 1,
    });

    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response: any) => {
        const { companies = [] } = response;
        return {
          data: companies.map((item: any, index: number) => {
            return {
              ...item,
              index: index + 1,
              nomEstado: item.estado ? 'Activo' : 'Inactivo',
              emails: item.email ? item.email.split(SEPARADORES_REGEX) : [],
              telefonos: item.telefono ? item.telefono.split(SEPARADORES_REGEX) : [],
            };
          }),
        };
      }),
    );
  }
  update(params: Partial<CompanyList>): Observable<ApiResponseLegacy> {
    return this.http.put<ApiResponseLegacy>(`${this.url}${params.idEntidad}`, { data: params });
  }
  private url = `${PATHS_API.CONFIG}${CONFIG_PATHS.COMPANY}`;
  private http = inject(HttpClient);
}
