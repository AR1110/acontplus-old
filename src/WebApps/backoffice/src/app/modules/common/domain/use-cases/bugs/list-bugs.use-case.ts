import {  Injectable } from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import { Observable } from 'rxjs';
import {BugsResponse} from "@modules/common/domain/models/bugs.model";
import {BugsRepository} from "@modules/common/domain/repositories/bugs.repository";
@Injectable({
  providedIn: 'root',
})
export class ListBugsUseCase implements BaseUseCase<BugsResponse, any> {
  constructor(private repo:BugsRepository) {
  }

  execute(params: any): Observable<BugsResponse> {
        return this.repo.list(params)
    }





}
