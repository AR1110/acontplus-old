import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient, HttpContext } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { map } from 'rxjs';
import { CompanyCustomerRepository } from '@company-customer/domain/company-customer.repository';
import { SearchCompanyCustomerParams } from '@company-customer/domain/entities/company-customer.entity';
import { SearchCompanyCustomerMapper } from '@company-customer/infrastructure/mappers/search-company-customer.mapper';
import { GetIdCompanyCustomerMapper } from '@company-customer/infrastructure/mappers/get-id-company-customer.mapper';
import { ListCompanyCustomerMapper } from '@company-customer/infrastructure/mappers/list-company-customer.mapper';
import { GetFormDataCompanyCustomerMapper } from '@company-customer/infrastructure/mappers/get-form-data-company-customer.mapper';
import { UpdateCompanyCustomerParamsDto } from '@company-customer/domain/dtos/company-customer.dto';
import { CreateUpdateCompanyCustomerMapper } from '@company-customer/infrastructure/mappers/create-update-company-customer.mapper';

@Injectable({
  providedIn: 'root',
})
export class CompanyCustomerWebRepository implements CompanyCustomerRepository {
  private _url = `${PATHS_API.BILLING}CompanyCustomer/`;
  private _http = inject(HttpClient);

  getAll<T extends { pageIndex: number; pageSize: number }>(obj: T) {
    const json = ListCompanyCustomerMapper.toJson(obj);
    return this._http
      .get<ApiResponseLegacy>(`${this._url}?json=${json}`)
      .pipe(map((response) => ListCompanyCustomerMapper.fromJson(response)));
  }

  getDataForm() {
    const json = GetFormDataCompanyCustomerMapper.toJson();
    return this._http
      .get<ApiResponseLegacy>(`${this._url}?json=${json}`)
      .pipe(map((response) => GetFormDataCompanyCustomerMapper.fromJson(response)));
  }

  getId(id: number, noLoader?: boolean) {
    return this._http
      .get<ApiResponseLegacy>(`${this._url}GetId/${id}` )
      .pipe(map((response) => GetIdCompanyCustomerMapper.fromJson(response)));
  }

  search(obj: SearchCompanyCustomerParams) {
    const json = SearchCompanyCustomerMapper.toJson(obj);
    return this._http
      .get<ApiResponseLegacy>(`${this._url}Search?json=${json}` )
      .pipe(map((response) => SearchCompanyCustomerMapper.fromJson(response)));
  }

  checkExistence<T>(params: T) {
    const json = JSON.stringify({ ...params, tipo: 3 });
    return this._http.get<ApiResponseLegacy>(`${this._url}?json=${json}`).pipe(
      map((response) => {
        if (response.code === '1') {
          const [mainData] = JSON.parse(response.payload as string);
          const clienteRepository = mainData[0];
          if (!clienteRepository) {
            response.payload = null;
          } else {
            response.payload = clienteRepository;
          }
        }
        return response;
      }),
    );
  }

  updateState(idCliente: number) {
    return this._http.delete<ApiResponseLegacy>(`${this._url}${idCliente}`);
  }

  post(params: any) {
    return this._http
      .post<ApiResponseLegacy>(this._url, {
        data: CreateUpdateCompanyCustomerMapper.toJson(params),
      })
      .pipe(map((response) => CreateUpdateCompanyCustomerMapper.fromJson(response)));
  }

  put(params: UpdateCompanyCustomerParamsDto) {
    return this._http.put<ApiResponseLegacy>(`${this._url}${params.id}`, {
      data: CreateUpdateCompanyCustomerMapper.toJson(params.data),
    });
  }
}
