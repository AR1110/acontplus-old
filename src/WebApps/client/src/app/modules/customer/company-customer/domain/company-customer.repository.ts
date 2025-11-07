import {
  CompanyCustomerSearch,
  FormDataCompanyCustomerResponse,
  ListCompanyCustomerResponse,
  SearchCompanyCustomerParams,
} from '@company-customer/domain/entities/company-customer.entity';
import { UpdateCompanyCustomerParamsDto } from '@company-customer/domain/dtos/company-customer.dto';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';

export abstract class CompanyCustomerRepository {
  abstract getAll<T extends { pageIndex: number; pageSize: number }>(
    obj: T,
  ): Observable<ListCompanyCustomerResponse>;
  abstract updateState(idCliente: number): Observable<ApiResponseLegacy>;
  abstract checkExistence<T>(params: T): Observable<ApiResponseLegacy>;
  abstract getDataForm(): Observable<FormDataCompanyCustomerResponse>;
  abstract getId(idCliente: number, loader?: boolean): Observable<any>;
  abstract put(params: UpdateCompanyCustomerParamsDto): Observable<ApiResponseLegacy>;
  abstract post<T>(data: T): Observable<ApiResponseLegacy>;

  abstract search(obj: SearchCompanyCustomerParams): Observable<CompanyCustomerSearch[]>;
}
