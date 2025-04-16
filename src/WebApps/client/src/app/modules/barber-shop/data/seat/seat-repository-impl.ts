import {inject, Injectable} from "@angular/core";
import {SeatRepository} from "@barber-shop/domain/repositories/seat.repository";
import {Observable} from "rxjs";
import {PATHS_API} from "@core/constants/global.constants";
import {BARBER_SHOP_PATHS} from "@barber-shop/domain/enums/barber-shop.enum";
import {HttpClient} from "@angular/common/http";
import { ApiResponse } from "@core/models/api-response";

@Injectable({
  providedIn: 'root'
})
export class SeatRepositoryImpl implements SeatRepository {
    // override create(): Observable<ApiResponse> {
    //     throw new Error("Method not implemented.");
    // }
    // override update(): Observable<ApiResponse> {
    //     throw new Error("Method not implemented.");
    // }
    // override remove(): Observable<ApiResponse> {
    //     throw new Error("Method not implemented.");
    // }
    list(): Observable<any> {
      return this.http.get(`${this.url}`)
  }

  private url = `${PATHS_API.BARBER_SHOP}/${BARBER_SHOP_PATHS.SEAT}`;
    private http = inject(HttpClient)
}
