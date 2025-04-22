import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {Observable} from "rxjs";
import {SeatRepository} from "@barber-shop/domain/repositories/seat.repository";


@Injectable({
  providedIn: 'root'
})
export class ListSeatUseCase implements BaseUseCase<any, any> {
  constructor(private repo:SeatRepository) {
  }
    execute(params: any): Observable<any> {
        return this.repo.list()
    }

}
