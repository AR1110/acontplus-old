import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { RESTAURANT_PATHS } from '@restaurant/enums/restaurant.enum';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  private url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.PROMOTION}`;
  private http = inject(HttpClient);


  getAll<T>(obj:T){
    let json = JSON.stringify({
      tipo: 1,
      ...obj
    })

    return this.http.get<ApiResponse>(`${this.url}?json=${json}`).pipe(
      map(response=>{
        let result = {
          days: [] as any[]
        }
        if(response.code==="1"){
          let {days} = JSON.parse(response.payload as string);
          result.days = days || [];

        }
       return result;
      })
    )
  }

}
