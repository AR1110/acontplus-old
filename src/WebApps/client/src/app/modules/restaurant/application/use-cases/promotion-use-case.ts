import { BaseUseCase } from '@core/base-use-case';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PromotionRepository } from '@restaurant/domain/repositories/promotion-repository';
import { PagedResult } from '@acontplus/core';
import { PromotionListDto } from '@restaurant/domain/models/promotion';

@Injectable({
  providedIn: 'root',
})
export class PromotionListUseCase implements BaseUseCase<PagedResult<PromotionListDto>, any> {
  #repo = inject(PromotionRepository);
  execute(params: any): Observable<PagedResult<PromotionListDto>> {
    return this.#repo.list(params);
  }
}

@Injectable({
  providedIn: 'root',
})
export class PromotionInsertUseCase implements BaseUseCase<any, any> {
  #repo = inject(PromotionRepository);
  execute(params: any): Observable<any> {
    return this.#repo.insert(params);
  }
}

@Injectable({
  providedIn: 'root',
})
export class PromotionUpdateUseCase implements BaseUseCase<any, any> {
  #repo = inject(PromotionRepository);
  execute(params: any): Observable<any> {
    return this.#repo.update(params);
  }
}

@Injectable({
  providedIn: 'root',
})
export class PromotionGetByIdUseCase implements BaseUseCase<any, number> {
  #repo = inject(PromotionRepository);
  execute(id: number): Observable<any> {
    return this.#repo.getById(id);
  }
}
