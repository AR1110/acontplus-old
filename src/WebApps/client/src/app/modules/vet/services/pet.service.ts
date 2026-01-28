import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PATHS_API } from '@core/constants/global.constants';
import { API_ENDPOINTS } from '@modules/vet/constants/vet.constants';
import { map, Observable } from 'rxjs';
import { isApiResponse } from '@core/models/api-response-legacy';
import { Pet } from '@modules/vet/models/pet.model';

@Injectable({
  providedIn: 'root',
})
export class PetService {
  private http = inject(HttpClient);
  private url = `${PATHS_API.VET}${API_ENDPOINTS.PET}`;

  delete(id: number) {
    return this.http.delete(`${this.url}${id}`).pipe(map((response) => response));
  }

  get<T>(parameters: T) {
    return this.http
      .get(`${this.url}?json=${JSON.stringify(parameters)}`)
      .pipe(map((response) => response));
  }

  post(data: any) {
    return this.http.post(`${this.url}`, data).pipe(map((response) => response));
  }

  put(id: number, data: any) {
    return this.http.put(`${this.url}${id}`, data).pipe(map((response) => response));
  }

  search<T extends { textSearch: string }>(data: T): Observable<Pet[]> {
    const query = {
      tipo: 2,
      textSearch: data.textSearch,
      pageIndex: 1,
      pageSize: 20,
    };
    return this.http
      .get(`${this.url}?json=${JSON.stringify(query)}` )
      .pipe(
        map((response) => {
          if (isApiResponse(response)) {
            const { pets } = (response.payload && JSON.parse(response.payload as string)) || [];
            return pets || [];
          }
          return [];
        }),
      );
  }
}
