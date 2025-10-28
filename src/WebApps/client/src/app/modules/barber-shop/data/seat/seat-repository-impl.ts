import { inject, Injectable } from '@angular/core';
import { SeatRepository } from '@barber-shop/domain/repositories/seat.repository';
import { map, Observable } from 'rxjs';
import { PATHS_API } from '@core/constants/global.constants';
import { BARBER_SHOP_PATHS } from '@barber-shop/domain/enums/barber-shop.enum';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/api-response';
import { SeatCreateDto, SeatUpdateParams } from '@modules/barber-shop/domain/models/seat.model';
import { ListSeatMapper } from '@barber-shop/data/seat/list-seat.mapper';

@Injectable({
  providedIn: 'root',
})
export class SeatRepositoryImpl implements SeatRepository {
  create(params: SeatCreateDto): Observable<ApiResponse> {
    console.log(params);
    return this.http.post<ApiResponse>(`${this.url}`, params);
  }

  update(params: SeatUpdateParams): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.url}${params.id}`, params);
  }
  // override create(): Observable<ApiResponse> {
  //     throw new Error("Method not implemented.");
  // }
  // override update(): Observable<ApiResponse> {
  //     throw new Error("Method not implemented.");
  // }
  // override remove(): Observable<ApiResponse> {
  //     throw new Error("Method not implemented.");
  // }
  list() {
    return this.http.get<ApiResponse>(`${this.url}`).pipe(map(res => ListSeatMapper.fromJson(res)));
  }

  private url = `${PATHS_API.BARBER_SHOP}/${BARBER_SHOP_PATHS.SEAT}`;
  private http = inject(HttpClient);
}
