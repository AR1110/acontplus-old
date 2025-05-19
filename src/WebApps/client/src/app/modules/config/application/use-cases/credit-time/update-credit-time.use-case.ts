import {BaseUseCase} from "@core/base-use-case";
import {CreditTimeRepository} from "@modules/config/domain/repositories/credit-time.repository";
import {Injectable} from "@angular/core";
import { Observable } from "rxjs";
import {ApiResponse} from "@core/models/api-response";

@Injectable({
  providedIn: "root",
})
export class UpdateCreditTimeUseCase implements BaseUseCase<ApiResponse, any> {
  constructor(private repo: CreditTimeRepository) {
  }

  execute(params: any): Observable<ApiResponse> {
       return this.repo.update(params)
    }

}
