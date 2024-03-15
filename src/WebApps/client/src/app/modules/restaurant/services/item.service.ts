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

export class ItemService {
  private url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.ITEM}`;
  private http = inject(HttpClient);

  search<T>(obj: T) {
    const json = JSON.stringify({
      ...obj,
      tipo: 1,
      pageIndex: 1,
      pageSize: 30
    })
    return this.http.get(`${this.url}?json=${json}`)
      .pipe(
        map((response: any) => {
          if (response !== null && response) {
            return response.items;
          }

        })
      )
  }
}
