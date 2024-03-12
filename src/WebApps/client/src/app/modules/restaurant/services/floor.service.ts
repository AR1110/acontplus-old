import { Injectable, inject } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { RESTAURANT_PATHS } from "../enums/restaurant.enum";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import { Floor } from "../models/floor.model";
import { Room } from "../models/room.model";
import { Table } from "../models/table.model";


@Injectable({
  providedIn: 'root'
})

export class FloorService {
  private url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.FLOOR}`;
  private http = inject(HttpClient);

  post<T>(data: T) {
    return this.http.post(`${this.url}`, data)
  }

  put<T>(id: number, data: T) {
    return this.http.put(`${this.url}${id}`, data)
  }

  remove(id: number) {
    return this.http.delete(`${this.url}${id}`)

  }
}
