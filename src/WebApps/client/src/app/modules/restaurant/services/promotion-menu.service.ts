import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { RESTAURANT_PATHS } from '../enums/restaurant.enum';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class PromotionMenuService {
  private url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.PROMOTION_MENU}`;
  private http = inject(HttpClient);
  constructor() { }

  getByPromotionId<T>(id:number, obj: T){
    let json = JSON.stringify({
      tipo: 1,
      ...obj
    })

    return this.http.get<ApiResponse>(`${this.url}GetById/${id}?json=${json}`).pipe(
      map(response=>{
        let result = {
          promotionMenus: []
        }
        if(response.code==="1"){
          let mainData = JSON.parse(response.payload as string)
          console.log(mainData)
          let promotionMenus = mainData.promotionMenus || [];
          result.promotionMenus = promotionMenus
        }
        return  result;
      })
    )

  }
  
}
