import { ApiResponse } from "@core/models/api-response";
import {NotaEntregaRepository} from "@sale/domain/repositories/nota-entrega.repository";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class NotaEntregaUseCase   {
  constructor(private repo: NotaEntregaRepository) {
  }

   getDataFilter(): Observable<any> {
        return  this.repo.getDataFilter()
    }
     getAll<T>(obj: T): Observable<any> {
       return  this.repo.getAll(obj)
    }
     getDetalleCompleto(id: number): Observable<any> {
        return  this.repo.getDetalleCompleto(id)
    }
     post<T>(obj: T): Observable<ApiResponse> {
      return  this.repo.post<T>(obj)
    }
     put<T>(id: number, obj: T): Observable<ApiResponse> {
       return this.repo.put(id, obj)
    }




}
