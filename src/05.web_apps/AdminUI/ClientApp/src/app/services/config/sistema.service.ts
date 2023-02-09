import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SistemaCreateDTO, SistemaUpdateDTO } from "@models/config/sistema.model";
import { StructureResponse } from "@models/structure-response.model";
import { environment } from "@env/environment";
import { tap } from "rxjs";


@Injectable({
  providedIn:'root'
})


export class SistemaService {

  private baseUrl: string = `${environment.baseUrl}api/Sistema`;

  constructor(private http:HttpClient){}

  getAll(){
    return this.http.get<StructureResponse>(`${this.baseUrl}/Get/${JSON.stringify({tipo:'G'})}`);
  }

  save(data:SistemaCreateDTO){
    return this.http.post<StructureResponse>(`${this.baseUrl}/Post`, data);
  }

  update(id:number, data:SistemaUpdateDTO){
    return this.http.put<StructureResponse>(`${this.baseUrl}/Put?id=${id}`, data);
  }

  delete(id:number){
    return this.http.delete<StructureResponse>(`${this.baseUrl}/Delete?id=${id}`);
  }

}
