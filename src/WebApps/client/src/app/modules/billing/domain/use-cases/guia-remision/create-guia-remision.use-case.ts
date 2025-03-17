import { Injectable } from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import { Observable } from 'rxjs';
import {GuiaRemisionRepository} from "@billing/domain/repositories/guia-remision.repository";

@Injectable({
  providedIn: 'root',
})
export class CreateGuiaRemisionUseCase implements BaseUseCase<any, any> {
  constructor(private repo: GuiaRemisionRepository) {
  }

  execute(params: any): Observable<any> {
        throw new Error('Method not implemented.');
    }

}
