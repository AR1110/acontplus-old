import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PATHS_API} from "@core/constants/global.constants";
import {CONFIG_PATHS} from "@modules/config/enums/config.enums";
import {map} from "rxjs";
import {customUrl} from "@core/interceptors/inject-session.interceptor";
import {ApiResponse} from "@core/models/api-response";

@Injectable({
  providedIn: 'root'
})
export class PrinterService {
  private http = inject(HttpClient)
  private url = `${PATHS_API.CONFIG}${CONFIG_PATHS.PRINTER}`
  private  urlPrinter = `${PATHS_API.PRINT_SERVER}GetPrinters`


  getPrinters(){
    let json = JSON.stringify({
      tipo: 1
    })
    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response:any)=> {
        let {printers} = response;
        let results =  printers.map((item:any) => {
          item.default = item.isDefault ? 'Si' : 'No';
          item.server = item.serverDevice ? 'Si' : 'No';
          item.labelEnabled = item.enabled ? 'Activa' : 'Inactiva';
          return item
        })
        return {
          printers: results
        }
      })
    )
  }


  getDataForm(){
    let json = JSON.stringify({
      tipo: 2
    })
    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response:any)=>{
        const {estabs,documents,printerTypes} = response;
        return {
          estabs,
          documents,
          printerTypes
        }
      })
    )
  }

  getLocalPrinters(){
    return this.http.get<ApiResponse>(this.urlPrinter, {
      context: customUrl()
    }).pipe(
      map(response=>{
        let mainData = JSON.parse(response.payload as string)
        return {
          localPrinters:mainData
        }
      })
    )

  }


  getDataEdit(id:number){
    let json = JSON.stringify({
      tipo: 3,
      id,
    })
    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response:any)=>{
        const {documents, printer} = response;
        return {
          data: printer[0],
          documents
        }
      })
    )
  }


  updateStatus<T>(id:number, data:T){
    return this.http.put(`${this.url}${id}`, data)
  }

  removePrinter(id:number){
    return this.http.delete(`${this.url}${id}`)
  }

  post<T>(data:T){
    return this.http.post(`${this.url}`, data)
  }

  put<T>(id:number, data:T){
    return this.http.put(`${this.url}${id}`, data)
  }


}
