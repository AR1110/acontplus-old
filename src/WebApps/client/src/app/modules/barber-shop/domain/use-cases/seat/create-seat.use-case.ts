import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {Observable} from "rxjs";
import {SeatRepository} from "@barber-shop/domain/repositories/seat.repository";
import {ApiResponse} from "@core/models/api-response";
import {SeatCreateDto} from "@barber-shop/domain/models/seat.model";


@Injectable({
  providedIn: 'root'
})
export class CreateSeatUseCase implements BaseUseCase<ApiResponse, SeatCreateDto> {
  constructor(private repo:SeatRepository) {
  }

  execute(params: SeatCreateDto): Observable<ApiResponse<unknown>> {
        return this.repo.create(params)
    }


}
