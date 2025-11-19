import {computed, inject, Injectable, signal} from "@angular/core";
import {LookupListUseCase} from "@restaurant/application/use-cases/lookup-use-case";
import {LookupItem} from "@core/models/lookup-type";

@Injectable({
  providedIn: 'root',
})
export class LookupService {
  lookupListUseCase = inject(LookupListUseCase);
  establishments = signal<LookupItem[]>([]);
  taxes = signal<LookupItem[]>([]);


  getLookupList() {
    return this.lookupListUseCase.execute({
      type: {
        module: 'Promotions',
        context: 'Formss'
      },
      keys: 'establishments,taxes'
    }).subscribe(response => {
      this.establishments.set(response.establishments);
      this.taxes.set(response.taxes);
    })
  }

}
