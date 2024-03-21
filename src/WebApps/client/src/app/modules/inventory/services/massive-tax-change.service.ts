import { inject, Injectable } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { INVENTORY_PATHS } from "../enums/inventory.enum";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";


@Injectable({
  providedIn: 'root'
})

export class MassiveTaxChangeService {
  private url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.MASSIVE_TAX_CHANGE}`;
  private http = inject(HttpClient);

  getAll<T>(obj: T) {
    const json = JSON.stringify({ ...obj, tipo: 1 })
    return this.http.get(`${this.url}?json=${json}`).pipe(
      map(response => {
        console.log(response)
      })
    )
  }

  post<T>(data: T) {
    return this.http.post(`${this.url}`, data)
  }
}
