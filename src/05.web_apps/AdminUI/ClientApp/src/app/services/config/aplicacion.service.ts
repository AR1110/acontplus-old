
import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core'
import { AplicacionCreateDTO, AplicacionUpdateDTO} from '@models/config/aplicacion.model';
import { environment } from '@env/environment'
import { StructureResponse } from '@app/models/structure-response.model';

@Injectable({
  providedIn:'root'
})

export class AplicacionService{
  appiUrl = environment.baseUrl;

  constructor(private http:HttpClient){}


  getAll(json:object){
    return this.http.get<StructureResponse>(`${this.appiUrl}api/Aplicacion/Get/${JSON.stringify(json)}`);
  }

  save(data:AplicacionCreateDTO){
    return this.http.post<StructureResponse>(`${this.appiUrl}api/Aplicacion/Post`, data);
  }

  update(id:number, data:AplicacionUpdateDTO){
    return this.http.put<StructureResponse>(`${this.appiUrl}api/Aplicacion/Put?id=${id}`, data);
  }

  delete(id:number){
    return this.http.delete<StructureResponse>(`${this.appiUrl}api/Aplicacion/Delete?id=${id}`);
  }

  getAllSistema(){
    return this.http.get<StructureResponse>(`${this.appiUrl}api/Sistema/Get/${JSON.stringify({tipo:'O'})}`)
  }






}
