import { Observable } from "rxjs";

export abstract class ComprobanteIngresoRepository {
  abstract getAll<T>(obj:T): Observable<any[]>;
 // abstract getById<T>(obj:T): Observable<any[]>;
}
