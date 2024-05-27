import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PATHS_API } from '@core/constants/global.constants';
import { API_ENDPOINTS } from '@modules/vet/constants/vet.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PetTypeService {
  private http = inject(HttpClient);
  private url = `${PATHS_API.VET}${API_ENDPOINTS.PET_TYPE}`;

  delete(id: number) {
    return this.http
      .delete(`${this.url}${id}`)
      .pipe(map((response) => response));
  }

  get<T>(parameters: T) {
    return this.http
      .get(`${this.url}?json=${JSON.stringify(parameters)}`)
      .pipe(map((response) => response));
  }

  post(data: any) {
    return this.http
      .post(`${this.url}`, data)
      .pipe(map((response) => response));
  }

  put(id: number, data: any) {
    return this.http
      .put(`${this.url}${id}`, data)
      .pipe(map((response) => response));
  }
}
