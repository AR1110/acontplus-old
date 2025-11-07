import { inject, Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { Observable } from 'rxjs';
import { ItemRepository } from '@restaurant/domain/repositories/item.repository';
import { CATEGORY_ABBREVIATIONS } from '@restaurant/domain/enums/restaurant.enum';
import {PagedResult, PaginationParams} from "@acontplus/core";

@Injectable({
  providedIn: 'root',
})
export class ItemListUseCase implements BaseUseCase<PagedResult<any>, PaginationParams> {
  private repo = inject(ItemRepository);
  execute(params: PaginationParams): Observable<PagedResult<any>> {
    return this.repo.list(params);
  }
}

@Injectable({
  providedIn: 'root',
})
export class ItemSearchUseCase implements BaseUseCase<PagedResult<any>, PaginationParams> {
  private repo = inject(ItemRepository);
  execute(params: PaginationParams): Observable<any> {
    const categoryAbbreviation = params.filters?.["categoryAbbreviation"];
    const searchTerm = params.filters?.["searchTerm"];
    if (!categoryAbbreviation) {
      throw new Error('categoryAbbreviation is required');
    }

    if (
      ![
        CATEGORY_ABBREVIATIONS.RESTAURANT,
        CATEGORY_ABBREVIATIONS.COMBO,
        CATEGORY_ABBREVIATIONS.INGREDIENT,
      ].includes(categoryAbbreviation)
    ) {
      throw new Error('categoryAbbreviation is invalid');
    }

    if (!searchTerm) {
      throw new Error('q is required');
    }
    return this.repo.search(params);
  }
}

@Injectable({
  providedIn: 'root',
})
export class ItemGetBydIdUseCase implements BaseUseCase<any, number> {
  private repo = inject(ItemRepository);
  execute(id: number): Observable<any> {
    if (!id) throw new Error('id is required');
    return this.repo.getById(id);
  }
}
