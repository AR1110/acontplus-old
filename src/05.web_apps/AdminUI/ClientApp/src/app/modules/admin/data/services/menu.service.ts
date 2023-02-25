



import { Injectable } from '@angular/core';
import { ApiService } from '@app/core/services/api.service';
import { Observable} from 'rxjs';
import { map} from 'rxjs/operators';
import { IMenu } from '../../domain/models/menu.model';
import { MenuEntity } from '../entities/menu.entity';
import { MenuMapper } from '../mappers/menu.mapper';
import { GenericResponse } from '@app/core/interfaces/generic-response.interface';

const safeJsonParse = <T>(guard: (o: any) => o is T) =>
  (text: string): ParseResult<T> => {
    const parsed = JSON.parse(text)
    return guard(parsed) ? { parsed, hasError: false } : { hasError: true }
  }

type ParseResult<T> =
  | { parsed: T; hasError: false; error?: undefined }
  | { parsed?: undefined; hasError: true; error?: unknown }

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  url = 'Menu/'
  mapper = new MenuMapper()

  constructor(private _apiSvc: ApiService){}


  getAll(): Observable<IMenu[]>{
    return this._apiSvc.get<GenericResponse>(`${this.url}Get/${JSON.stringify({test: ''})}`)
                        .pipe(map(response=>JSON.parse(response.payload)))
  }

  save(data: IMenu): Observable<IMenu>{
    return this._apiSvc.post( this.url + 'Post', this.mapper.mapTo(data))
  }

  update(id: number, data: IMenu){
    return this._apiSvc.put(this.url +  'Put?id=' + id, this.mapper.mapTo(data))
  }

  delete(id: number){
    return this._apiSvc.delete(this.url + 'Delete/' + id)
  }


}
