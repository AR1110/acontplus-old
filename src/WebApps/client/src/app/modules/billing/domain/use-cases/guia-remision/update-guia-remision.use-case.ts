import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UpdateGuiaRemisionUseCase implements BaseUseCase<any, any> {
  constructor() {}

  execute(params: any): Observable<any> {
    throw new Error('Method not implemented.');
  }
}
