import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { map } from 'rxjs';
import { SupplierRepository } from '@customer/domain/repositories/supplier.repository';
import { CUSTOMER_PATHS } from '@customer/shared/enums/customer.enum';
import { SupplierSearch } from '@customer/domain/models/supplier.interface';
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
    const json = JSON.stringify({
      tipo: 5,
      textSearch: obj.textSearch,
    });

    return this._http
      .get<ApiResponseLegacy>(`${this._url}?json=${json}` )
      .pipe(
        map((response) => {
          let suppliers: SupplierSearch[] = [];

          if (response?.code === '1') {
            const { proveedores } = JSON.parse(response.payload as string);
            suppliers = SupplierMapper.fromApiSearch(proveedores);
          }
          return suppliers;
        }),
      );
  }
}
