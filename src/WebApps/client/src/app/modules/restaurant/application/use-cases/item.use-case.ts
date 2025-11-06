import { inject, Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { Observable } from 'rxjs';
import { ItemRepository } from '@restaurant/domain/repositories/item.repository';
import {CATEGORY_ABBREVIATIONS} from "@restaurant/domain/enums/restaurant.enum";

@Injectable({
  providedIn: 'root',
})
export class ItemListUseCase implements BaseUseCase<any, any> {
  private repo = inject(ItemRepository);
  execute(params: any): Observable<any> {
    return this.repo.list(params);
  }
}



@Injectable({
  providedIn: 'root',
})
export class ItemSearchUseCase implements BaseUseCase<any, any> {
  private repo = inject(ItemRepository);
  execute(params: any): Observable<any> {
    if(!params.categoryAbbreviation){
      throw new Error('categoryAbbreviation is required');
    }

    if(!([CATEGORY_ABBREVIATIONS.RESTAURANT, CATEGORY_ABBREVIATIONS.COMBO, CATEGORY_ABBREVIATIONS.INGREDIENT].includes(params.categoryAbbreviation))){
      throw new Error('categoryAbbreviation is invalid');
    }

    if(!params.q){
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
    if (!id)
      throw new Error('id is required');
    return this.repo.getById(id);
  }
}
