import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiPaths } from "@app/enums/api-paths";
import { StructureResponse } from "@models/structure-response.model";
import { environment } from "@env/environment";
import { map} from "rxjs";
import { Asignacion, AsignacionCreateDTO } from "@app/models/config/asignacion.model";


@Injectable({
  providedIn:'root'
})


export class AsignacionService{
  private BASE_URL = environment.baseUrl;
  private URL = this.BASE_URL + ApiPaths.Asignacion;

  constructor(private _http:HttpClient){}

  getAll(){
    return this._http.get<StructureResponse>(`${this.URL}/Get/${JSON.stringify({tipo:'G'})}`).pipe(map(data=>JSON.parse(data.payload)))
  }

  save(data:AsignacionCreateDTO){
    return this._http.post<StructureResponse>(this.URL + '/Post', data).pipe(map(this.parseResponse)
      )
  }


  update(id:number, data:Asignacion){
    return this._http.put<StructureResponse>(this.URL + '/Put', data, {
      params: {id}
    }).pipe(map(this.parseResponse))
  }


  delete(id: number){
    return this._http.delete<StructureResponse>(this.URL + '/Delete',{params:{id}}).pipe(map(this.parseResponse))
  }

  getAllAplicacionMenu(){
    return this._http.get<StructureResponse>(`${this.BASE_URL}${ApiPaths.AplicacionMenu}/Get/${JSON.stringify({tipo:'O'})}`)
    .pipe(map((data)=>JSON.parse(data.payload)))
  }

  getAllAction(){
    return this._http.get<StructureResponse>(`${this.BASE_URL}${ApiPaths.Accion}/Get/${JSON.stringify({tipo:'O'})}`)
    .pipe(map(data=>JSON.parse(data.payload)));
  }

  private parseResponse(response: StructureResponse){
    return JSON.parse(response.payload)[0];
  }



}
