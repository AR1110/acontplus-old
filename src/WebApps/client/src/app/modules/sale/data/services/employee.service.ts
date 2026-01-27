import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

import { SALE_PATHS } from '@sale/domain/enums/sale.enum';
import { PATHS_API } from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private url = `${PATHS_API.SALES}${SALE_PATHS.EMPLOYEE}`;
  private http = inject(HttpClient);

  search<T extends { textSearch: string }>(obj: T) {
    const params = JSON.stringify({ ...obj, tipo: 1 });

    return this.http
      .get(`${this.url}Search?json=${params}` )
      .pipe(
        map((response) => {
          if (isApiResponse(response)) {
            const employees = (response.payload && JSON.parse(response.payload as string)) || [];
            return employees.map((employee: any) => {
              return {
                idEmpleado: employee.idEmpleado,
                nroIdentificacion: employee.nroIdentificacion,
                nombreCompleto: employee.nombreCompleto,
              };
            });
          }
          return [];
        }),
      );
  }
}
