import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CONFIG_PATHS } from '@modules/config/enums/config.enum';
import { ApiResponse } from 'acontplus-utils';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private URL = CONFIG_PATHS.DASHBOARD;

  constructor(private http: HttpClient) {}

  get(parameters: string = JSON.stringify({ tipo: 1 })) {
    return this.http.get<ApiResponse>(`${this.URL}?json=${parameters}`).pipe(
      map((response: any) => {
        if (response.code != '1') {
          return { companies: [], documents: [], licenses: [] };
        }
        const { companies, documents, licenses } = JSON.parse(
          response.payload as string,
        );
        return {
          companies: companies || [],
          documents: documents || [],
          licenses: licenses || [],
        };
      }),
    );
  }
}
