import {  Injectable } from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import { Observable } from 'rxjs';
import {GuiaRemisionRepository} from "@billing/domain/repositories/guia-remision.repository";
import { GuiasRemisionResponse} from "@billing/domain/models/guia-remision/guia-remision.model";

@Injectable({
  providedIn: 'root',
})
export class ListGuiasRemisionUseCase implements BaseUseCase<GuiasRemisionResponse, any> {
  constructor(private repo:GuiaRemisionRepository) {
  }

  execute(params: any): Observable<GuiasRemisionResponse> {
     return this.repo.list(params)
    }



}
