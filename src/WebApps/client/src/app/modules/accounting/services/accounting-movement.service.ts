import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {PATHS_API} from "@core/constants/global.constants";
import {ACCOUNTING_PATHS} from "@accounting/enums/accounting.constants";
import { map } from "rxjs";
import { ApiResponse } from "@core/models/api-response";
import {SubCategorySelectHtmlOnly} from "@accounting/models/subcategory";
@Injectable({
  providedIn: 'root'
})
export class AccountingMovementService {

 private http = inject(HttpClient)
  private url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.ACCOUNTING_MOVEMENT}`;
  
  getDataFilter(){
    let json = JSON.stringify({
      tipo: 2
    })
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`).pipe(
      map(response=>{
        let results = {
          transactionTypes: [] as any[],
          subCategories: [] as SubCategorySelectHtmlOnly[]
        }
        if(response.code==="1"){
          let {transactionType, subcategory} = JSON.parse(response.payload as string);
          
          results.subCategories = subcategory;
          results.transactionTypes=transactionType;
        }
        return results;
      })
       
    ) 
    
  }
}
