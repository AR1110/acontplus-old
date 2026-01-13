import { BaseUseCase } from '@core/base-use-case';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DocConfigInfoAdicionalList} from '@modules/config/domain/models/doc-config.model';
import { DocConfigRepository } from '@modules/config/domain/repositories/doc-config.repository';

@Injectable({
  providedIn: 'root',
})
export class GetDocConfigInfoAdicionalUseCase
  implements BaseUseCase<DocConfigInfoAdicionalList[], number>
{
  private repo = inject(DocConfigRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(ind: number): Observable<DocConfigInfoAdicionalList[]> {
    return this.repo.getInfoAdicionales(ind);
  }
}
