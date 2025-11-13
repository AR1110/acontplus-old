import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ProformaInvoiceRepository } from '@sale/domain/repositories/proforma-invoice.repository';
import { SALE_PATHS } from '@sale/domain/enums/sale.enum';
import { ProformaInvoiceListMapper } from '@sale/data/proforma-invoice/proforma-invoice-list.mapper';
import { ProformaInvoiceFilterMapper } from '@sale/data/proforma-invoice/proforma-invoice-filter.mapper';
import { ProformaInvoiceViewDetailMapper } from '@sale/data/proforma-invoice/proforma-invoice-view-detail.mapper';
import {ProformaInvoiceFormDataMapper} from "@sale/data/proforma-invoice/proform-invoice-form-data-mapper";

@Injectable({
  providedIn: 'root',
})
export class ProformaInvoiceHttpRepository implements ProformaInvoiceRepository {
  private readonly _url = `${PATHS_API.SALES}${SALE_PATHS.PROFORMA_INVOICE}`;
  private readonly _http = inject(HttpClient);

  getFilters(): Observable<any> {
    const json = ProformaInvoiceFilterMapper.toJson();
    return this._http
      .get<ApiResponseLegacy>(`${this._url}/Get?json=${json}`)
      .pipe(map((response) => ProformaInvoiceFilterMapper.fromJson(response)));
  }
  getAll<T>(obj: T) {
    const json = ProformaInvoiceListMapper.toJson(obj);
    return this._http
      .get<ApiResponseLegacy>(`${this._url}/Get?json=${json}`)
      .pipe(map((response) => ProformaInvoiceListMapper.fromJson(response)));
  }

  viewDetail(id: number) {
    const json = ProformaInvoiceViewDetailMapper.toJson(id);
    return this._http
      .get<ApiResponseLegacy>(`${this._url}/Get?json=${json}`)
      .pipe(map((response) => ProformaInvoiceViewDetailMapper.fromJson(response)));
  }

  getFormData(): Observable<any> {
    const json = ProformaInvoiceFormDataMapper.toJson();
    return this._http
      .get<ApiResponseLegacy>(`${this._url}/Get?json=${json}`)
      .pipe(map((response) => ProformaInvoiceFormDataMapper.fromJson(response)));
  }
}
