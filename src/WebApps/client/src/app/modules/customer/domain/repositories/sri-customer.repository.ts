
import { Observable } from "rxjs";

export abstract class SriCustomerRepository {
  abstract  search(codigo: string, id: string) : Observable<any>;

  abstract  searchByRuc(id: string):Observable<any>

abstract searchByCedula(id: string):Observable<any>;
}
