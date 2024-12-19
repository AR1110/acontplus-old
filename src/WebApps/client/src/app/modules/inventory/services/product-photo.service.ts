import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { INVENTORY_PATHS } from '@inventory/domain/enums/inventory.enum';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class ProductPhotoService {

  private url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.PRODUCT_PHOTO}`
  private http = inject(HttpClient)

  getByProductId(productId: number){
    return this.http.get<ApiResponse>(`${this.url}${productId}`).pipe(
      map((response) => {
        let result = {
          productPhotos:[] as any[]
        }
        if(response.code==="1"){
          let mainData =  response.payload  as any[]

          result.productPhotos = mainData.map((item:any)=>{
            return {
              productId: item.productId,
              s3ObjectKey: item.s3ObjectKey,
              s3ObjectUrl: item.s3ObjectUrl,
              isDefault: item.isDefault,
              id: item.id,

            }
          })

        }
        return result;
      })
    )
  }

  getAll<T>(obj: T) {
    let json = JSON.stringify({
      ...obj, tipo: 1
    })
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`).pipe(
      map((response) => {
        console.log(response)
      })
    )
  }


  post(productId: number, file: any) {

    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse>(`${this.url}${productId}`, formData)
  }

  put<T>(id: number, data: T, file: any) {
    const formData = new FormData();
    formData.append('file', file);
    let json = JSON.stringify(data)
    return this.http.post<ApiResponse>(`${this.url}Put/${id}?json=${json}`, formData)
  }

  setDefault(id: number, isDefault: boolean) {
    return this.http.put<ApiResponse>(`${this.url}SetDefault/${id}/${isDefault}`, null)
  }

  updateStatus(id: number) {
    return this.http.delete<ApiResponse>(`${this.url}${id}`)
  }

}
