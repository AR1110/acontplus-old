import{Inject, Injectable} from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Accion } from '@models/config/accion.model';
import { StructureResponse } from '@app/models/structure-response.model';

@Injectable({
  providedIn:'root'
})


export class AccionService{

  appiUrl = '';
  constructor(private http:HttpClient, @Inject('BASE_URL') baseUrl: string){
    console.log(baseUrl)
  }

  getAll(){
    return this.http.get<StructureResponse>(`${this.appiUrl}/Get/${JSON.stringify({'key':'value'})}`);
  }

  save(data:Accion){
    return this.http.post<StructureResponse>(`${this.appiUrl}/Post?json=${JSON.stringify(data)}`, '');
  }

  update(id: number, data:Accion){
    return this.http.put<StructureResponse>(`${this.appiUrl}/Put?id=${id}&json=${JSON.stringify(data)}`, '');
  }

  delete(id:number){
    return this.http.delete<StructureResponse>(`${this.appiUrl}/Delete?id=${id}`);
  }

}
