import { getNoLoader } from '@/core/interceptors/loader.interceptor';
import { PATHS, PATHS_API } from '@/enums/main.enum';
import { ApiResponse } from '@/models/api-response';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private http = inject(HttpClient);
  private url = `${PATHS_API.RESTAURANT}${PATHS.PROMOTION}`
  constructor() { }

  getPromotions<T>(obj: T) {
    let json = JSON.stringify(obj);

    return this.http.get<ApiResponse>(`${this.url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map(response => {
        console.log(response)
        return response;
      })
    )
  }

}
