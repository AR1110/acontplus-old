import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateLicenciaDTO, Licencia } from '@app/models/config/licencia.model';
import { StructureResponse } from '@app/models/structure-response.model';
import { environment } from '@env/environment';


@Injectable({providedIn: 'root'})

export class LicenciaService {
  baseUrl:string = `${environment.baseUrl}api/Licencia`;

  constructor(
    private http:HttpClient,
  ) { }

  getAll(){
    return this.http.get<StructureResponse>(`${this.baseUrl}/Get/${JSON.stringify({tipo:'G'})}`)
  }

  save(data:CreateLicenciaDTO){
    return this.http.post<StructureResponse>(`${this.baseUrl}/Post`, data)
  }

  update(id:number, data: Licencia){
    return this.http.put<StructureResponse>(`${this.baseUrl}/Put?id=${id}`, data)
  }

  delete(id:number){
    return this.http.delete<StructureResponse>(`${this.baseUrl}/Delete?id=${id}`)
  }

}
