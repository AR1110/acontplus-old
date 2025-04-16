import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ListSeatUseCase implements BaseUseCase<any, any> {
    execute(params: any): Observable<any> {
        throw new Error("Method not implemented.");
    }

}
