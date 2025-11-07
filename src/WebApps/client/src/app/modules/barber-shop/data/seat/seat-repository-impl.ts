import { inject, Injectable } from '@angular/core';
import { SeatRepository } from '@barber-shop/domain/repositories/seat.repository';
import { map, Observable } from 'rxjs';
import { PATHS_API } from '@core/constants/global.constants';
import { BARBER_SHOP_PATHS } from '@barber-shop/domain/enums/barber-shop.enum';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { SeatCreateDto, SeatUpdateParams } from '@modules/barber-shop/domain/models/seat.model';
import { ListSeatMapper } from '@barber-shop/data/seat/list-seat.mapper';

@Injectable({
  providedIn: 'root',
})
export class SeatRepositoryImpl implements SeatRepository {
  create(params: SeatCreateDto): Observable<ApiResponseLegacy> {
    console.log(params);
    return this.http.post<ApiResponseLegacy>(`${this.url}`, params);
  }

  update(params: SeatUpdateParams): Observable<ApiResponseLegacy> {
    return this.http.put<ApiResponseLegacy>(`${this.url}${params.id}`, params);
  }
  // override create(): Observable<ApiResponseLegacy> {
  //     throw new Error("Method not implemented.");
  // }
  // override update(): Observable<ApiResponseLegacy> {
  //     throw new Error("Method not implemented.");
  // }
  // override remove(): Observable<ApiResponseLegacy> {
  //     throw new Error("Method not implemented.");
  // }
  list() {
    return this.http
      .get<ApiResponseLegacy>(`${this.url}`)
      .pipe(map((res) => ListSeatMapper.fromJson(res)));
  }

  private url = `${PATHS_API.BARBER_SHOP}/${BARBER_SHOP_PATHS.SEAT}`;
  private http = inject(HttpClient);
}
