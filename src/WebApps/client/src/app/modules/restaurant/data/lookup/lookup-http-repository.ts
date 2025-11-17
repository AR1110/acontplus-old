import {inject, Injectable} from "@angular/core";
import {LookupRepository} from "@restaurant/domain/repositories/lookup-repository";
import { Observable } from "rxjs";
import {HttpClient} from "@angular/common/http";
import {PATHS_API} from "@core/constants/global.constants";
import { RESTAURANT_PATHS } from "@modules/restaurant/domain/enums/restaurant.enum";

@Injectable({
  providedIn: 'root'
})
export class LookupHttpRepository implements LookupRepository {
  #http = inject(HttpClient)
  #url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.LOOKUP}`;
  getLookup(lookupType: string): Observable<any> {
        throw new Error("Method not implemented.");
  }

}
