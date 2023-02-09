import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiPaths } from "@app/enums/api-paths";
import { GenericResponse, StructureResponse } from "@models/structure-response.model";
import { environment } from "@env/environment";
import { PlanCliente } from "@models/config/plan-cliente.model";
import { ApiPathsCliente } from "@app/enums/api-paths-cliente";
import {map} from 'rxjs'


@Injectable({
  providedIn:'root'
})


export class PlanClienteService{
  BASE_URL = environment.baseUrl;
  URL      = this.BASE_URL + ApiPaths.PlanCliente;

  BASE_URL_CLIENTE = environment.baseClienteUrl;
  URL_CLIENTE      = this.BASE_URL_CLIENTE + ApiPathsCliente.Entidad

  constructor(private http:HttpClient){}

  getAll(){
    return this.http.get<StructureResponse>(`${this.URL}/Get/${JSON.stringify({tipo:'G'})}`)
  }

  save(data: PlanCliente){
    return this.http.post<StructureResponse>(`${this.URL}/Post`, data)
    .pipe(map(response=>JSON.parse(response.payload)[0]))
  }

  update(id:number, data: PlanCliente){
    return this.http.put<StructureResponse>(`${this.URL}/Put?id=${id}`, data)
    .pipe(map(res=>JSON.parse(res.payload)[0]))
  }

  delete(id:number){
    return this.http.delete<StructureResponse>(`${this.URL}/Delete?id=${id}`)
    .pipe(map(res=>JSON.parse(res.payload)[0]))
  }

  // getAllEntidad(){
  //   return this.http.get<StructureResponse>(`${this.BASE_URL}api/Entidad/Get/${JSON.stringify({tipo:'O'})}`);
  // }

  //Obtenemos datos de la entidad de la Aplicacion Principal
  getAllEntidad(typeList:string){
    return this.http.get<GenericResponse>(`${this.URL_CLIENTE}/Get/${JSON.stringify({typeList})}`)
    .pipe(map(res=>JSON.parse(res.data)))
  }

  getAllLicencia(){
    return this.http.get<StructureResponse>(`${this.BASE_URL}api/Licencia/Get/${JSON.stringify({tipo:'O'})}`)
    .pipe(map(res=>JSON.parse(res.payload)))
  }

  getAllSuscripcion(){
    return this.http.get<StructureResponse>(`${this.BASE_URL}api/Suscripcion/Get/${JSON.stringify({tipo:'O'})}`)
    .pipe(map(res=>JSON.parse(res.payload)))
  }


}
