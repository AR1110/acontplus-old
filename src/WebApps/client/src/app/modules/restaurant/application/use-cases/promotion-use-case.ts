import {BaseUseCase} from "@core/base-use-case";
import {inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {PromotionRepository} from "@restaurant/domain/repositories/promotion-repository";


@Injectable({
  providedIn: 'root',
})
export class PromotionListUseCase implements BaseUseCase<any, any> {
  #repo = inject(PromotionRepository);
  execute(params: any): Observable<any> {
    return this.#repo.list(params);
  }
}
