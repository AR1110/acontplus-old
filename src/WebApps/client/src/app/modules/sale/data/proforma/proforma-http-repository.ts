import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ProformaRepository } from '@sale/domain/repositories/proforma.repository';
import { SALE_PATHS } from '@sale/domain/enums/sale.enum';
import { ProformaInvoiceListMapper } from '@sale/data/proforma/proforma-list-mapper';
import { ProformaFilterMapper } from '@sale/data/proforma/proforma-filter-mapper';
import { ProformaViewDetailMapper } from '@sale/data/proforma/proforma-view-detail-mapper';
import { ProformaInvoiceFormDataMapper } from '@sale/data/proforma/proforma-form-data-mapper';

@Injectable({
  providedIn: 'root',
})
export class ProformaHttpRepository implements ProformaRepository {
  private readonly _url = `${PATHS_API.SALES}${SALE_PATHS.PROFORMA_INVOICE}`;
  private readonly _http = inject(HttpClient);

  getFilters(): Observable<any> {
    const json = ProformaFilterMapper.toJson();
    return this._http
      .get<ApiResponseLegacy>(`${this._url}/Get?json=${json}`)
      .pipe(map((response) => ProformaFilterMapper.fromJson(response)));
  }
  getAll<T>(obj: T) {
    const json = ProformaInvoiceListMapper.toJson(obj);
    return this._http
      .get<ApiResponseLegacy>(`${this._url}/Get?json=${json}`)
      .pipe(map((response) => ProformaInvoiceListMapper.fromJson(response)));
  }

  viewDetail(id: number) {
    const json = ProformaViewDetailMapper.toJson(id);
    return this._http
      .get<ApiResponseLegacy>(`${this._url}/Get?json=${json}`)
      .pipe(map((response) => ProformaViewDetailMapper.fromJson(response)));
  }

  getFormData(): Observable<any> {
    const json = ProformaInvoiceFormDataMapper.toJson();
    return this._http
      .get<ApiResponseLegacy>(`${this._url}/Get?json=${json}`)
      .pipe(map((response) => ProformaInvoiceFormDataMapper.fromJson(response)));
  }
}
