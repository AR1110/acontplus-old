import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ACCOUNTING_PATHS } from '@accounting/shared/enums/accounting.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/api-response';
import { map } from 'rxjs';
import { ResumenContableRepository } from '@accounting/resumen-contable/domain/resumen-contable.repository';
import { SubCategorySelectHtmlOnly } from '@accounting/sub-category/domain/subcategory';

@Injectable({
  providedIn: 'root',
})
export class ResumenContableWebRepository extends ResumenContableRepository {
  private _url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.ACCOUNTING_MOVEMENT}`;
  private _http = inject(HttpClient);

  constructor() {
    super();
  }

  getDataFilter() {
    const json = JSON.stringify({
      tipo: 2,
    });
    return this._http.get<ApiResponse>(`${this._url}?json=${json}`).pipe(
      map(response => {
        const results = {
          transactionTypes: [] as any[],
          subCategories: [] as SubCategorySelectHtmlOnly[],
        };
        if (response.code === '1') {
          const { transactionType, subcategory } = JSON.parse(response.payload as string);

          results.subCategories = subcategory;
          results.transactionTypes = transactionType;
        }
        return results;
      }),
    );
  }
}
