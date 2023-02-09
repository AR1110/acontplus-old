import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiPaths } from '@app/enums/api-paths';
import { LicenciaPlan, LicenciaPlanUpdateDTO } from '@models/config/licencia-plan.model';
import { StructureResponse } from '@models/structure-response.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class LicenciaPlanService {
  apiUrl:string = environment.baseUrl;
  url:string = `${this.apiUrl}${ApiPaths.LicenciaPlan}`;

  constructor(
    private http:HttpClient
  ) { }

  getAll(){
    return this.http.get<StructureResponse>(`${this.url}/Get/${JSON.stringify({tipo:'G'})}`)
  }

  save(data:any){
    return this.http.post<StructureResponse>(`${this.url}/Post`, data);
  }

  update(id:number, data:LicenciaPlanUpdateDTO){
    return this.http.put<StructureResponse>(`${this.url}/Put?id=${id}`, data);
  }

  delete(id:number){
    return this.http.delete<StructureResponse>(`${this.url}/Delete?id=${id}`);
  }

  getAllAplicacion(){
    return this.http.get<StructureResponse>(`${this.apiUrl}api/Aplicacion/Get/${JSON.stringify({tipo:'O'})}`);
  }

  getAllLicencia(){
    return this.http.get<StructureResponse>(`${this.apiUrl}api/Licencia/Get/${JSON.stringify({tipo:'G'})}`)
  }


}
