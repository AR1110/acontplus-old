import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {Observable} from "rxjs";
import {ApiResponse} from "@core/models/api-response";
import {SeatRepository} from "@barber-shop/domain/repositories/seat.repository";
import {SeatUpdateParams} from "@barber-shop/domain/models/seat.model";


@Injectable({
  providedIn: 'root'
})
export class UpdateSeatUseCase implements BaseUseCase<ApiResponse, SeatUpdateParams> {
  constructor(private repo:SeatRepository) { }

  execute(params: SeatUpdateParams): Observable<ApiResponse<unknown>> {
       return this.repo.update(params)
    }

}
