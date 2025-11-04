import { inject, Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { Observable } from 'rxjs';
import { ItemRepository } from '@restaurant/domain/repositories/item.repository';

@Injectable({
  providedIn: 'root',
})
export class ItemListUseCase implements BaseUseCase<any, any> {
  private repo = inject(ItemRepository);
  execute(params: any): Observable<any> {
    return this.repo.list(params);
  }
}
