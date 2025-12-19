import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { map } from 'rxjs';
import { INVENTORY_PATHS } from '@inventory/domain/enums/inventory.enum';
import { MassiveTaxRepository } from '@inventory/domain/repositories/massive-tax.repository';
import { TarifaImpuesto } from '@shared/models/tarifa-impuesto.model';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { SubCategorySelectHtmlOnly } from '@inventory/domain/models/sub-category.model';
import { groupSubCategoryUtil } from '@inventory/domain/utils/group-sub-category.util';
import { getValidId } from '@core/utils/utils';

@Injectable({
  providedIn: 'root',
})
export class MassiveTaxHttp implements MassiveTaxRepository {
  private _url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.MASSIVE_TAX}`;
  private _http = inject(HttpClient);

  getDataForm() {
    const json = JSON.stringify({ tipo: 3 });
    return this._http
      .get(`${this._url}?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(
        map((response: any) => {
          let taxRates: TarifaImpuesto[] = [];
          let subCategories: SubCategorySelectHtmlOnly[] = [];
          if (response !== null && typeof response === 'object') {
            taxRates = response.taxes.map((item: any) => ({
              idTarifaImpuesto: item.idTipoIva,
              descripcion: item.descripcion,
              porcentaje: item.codigoPorcentaje,
            }));

            subCategories = groupSubCategoryUtil(response.subCategories || []);
          }
          return {
            taxRates,
            subCategories,
          };
        }),
      );
  }

  getAll<T>(obj: T) {
    const json = JSON.stringify({ ...obj, tipo: 1 });
    return this._http
      .get(`${this._url}?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(
        map((response: any) => {
          let histories = [];
          if (response !== null && typeof response === 'object') {
            histories = response.history.map((item: any, index: number) => {
              return {
                index: index + 1,
                ...item,
              };
            });
          }
          return histories;
        }),
      );
  }

  getQuantityProductByTaxId(obj: any) {
    const json = JSON.stringify({
      taxId: obj.taxId,
      tipo: 2,
      subCategoryId: getValidId(obj.subCategoryId),
    });
    return this._http.get(`${this._url}?json=${json}`).pipe(
      map((response: any) => {
        let quantity = 0;
        if (response !== null && typeof response === 'object') {
          quantity = Array.isArray(response.quantity) ? response.quantity[0]?.quantity : 0;
        }
        return quantity;
      }),
    );
  }

  put<T>(data: T) {
    return this._http.put<ApiResponseLegacy>(`${this._url}`, { data });
  }
}
