import { inject, Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { Observable, throwError } from 'rxjs';
import { ItemRepository } from '@restaurant/domain/repositories/item.repository';
import { CATEGORY_ABBREVIATIONS } from '@restaurant/restaurant-const';
import { PagedResult, PaginationParams } from '@acontplus/core';

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
    const categoryAbbreviation = params.filters?.['categoryAbbreviation'];
    const searchTerm = params.searchTerm;

    if (!categoryAbbreviation) {
      return throwError(() => new Error('categoryAbbreviation is required'));
    }

    // Convertir "COM,RES" → ["COM", "RES"]
    const categories = categoryAbbreviation
      .split(',')
      .map((c: string) => c.trim())
      .filter(Boolean);

    const validCategories = Object.values(CATEGORY_ABBREVIATIONS);

    const invalid = categories.filter(
      (c: any) => !validCategories.includes(c as CATEGORY_ABBREVIATIONS),
    );

    if (invalid.length) {
      return throwError(() => new Error(`Invalid categoryAbbreviation: ${invalid.join(', ')}`));
    }

    if (!searchTerm) {
      return throwError(() => new Error('q is required'));
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

@Injectable({
  providedIn: 'root',
})
export class ItemUpdateUseCase implements BaseUseCase<any, { id: number; data: any }> {
  execute(params: { id: number; data: any }): Observable<any> {
    return this.repo.update(params.id, params.data);
  }
  private repo = inject(ItemRepository);
}
