import { ItemAdapter } from '@/adapters/item.adapter';
import { PATHS, PATHS_API } from '@/enums/main.enum';
import { ApiResponse } from '@/models/api-response';
import { ItemRead } from '@/models/item.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromotionMenuService {
  private http = inject(HttpClient);
  private url = `${PATHS_API.RESTAURANT}${PATHS.PRMOTION_MENU}`;
  private itemAdapter = inject(ItemAdapter)

  constructor() { }

  getByPromotionId<T>(obj: any) {
    const params = new HttpParams().set('tipo', '2');

    return this.http.get<ApiResponse>(`${this.url}GetById/${obj.promotionId}`, { params })
      .pipe(
        map(response => {
          const result = {
            items: [] as ItemRead[]
          };

          if (response.code === "1" && typeof response.payload === 'string') {
            const { promotionMenus } = JSON.parse(response.payload); // Solo usar JSON.parse si response.payload es una cadena
            result.items = this.itemAdapter.getAllFrom(promotionMenus);
          }

          return result;
        })
      );
  }


}
