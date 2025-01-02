import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/api-response';
import { map } from 'rxjs';
import { SupplierRepository } from '@customer/core/repositories/supplier.repository';
import { CUSTOMER_PATHS } from '@customer/core/enums/customer.enum';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { SupplierSearch } from '@customer/core/domain/supplier.interface';
import { SupplierMapper } from '@customer/data/supplier/supplier.mapper';

@Injectable({
  providedIn: 'root',
})
export class SupplierWebRepository extends SupplierRepository {
  private _url = `${PATHS_API.PURCHASE}${CUSTOMER_PATHS.PROVEEDOR}`;
  private _http = inject(HttpClient);

  constructor() {
    super();
  }

  search<T extends { textSearch: string }>(obj: T) {
    let json = JSON.stringify({
      tipo: 5,
      textSearch: obj.textSearch,
    });

    return this._http
      .get<ApiResponse>(`${this._url}?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(
        map((response) => {
          let suppliers: SupplierSearch[] = [];

          if (response && response.code === '1') {
            let { proveedores } = JSON.parse(response.payload as string);
            suppliers = SupplierMapper.fromApiSearch(proveedores);
          }
          return suppliers;
        }),
      );
  }
}
