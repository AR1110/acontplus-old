import { Observable } from 'rxjs';
import { ListWarehouseResponse } from '@inventory/domain/models/warehouse.model';

export abstract class WarehouseRepository {
  abstract list(params: any): Observable<ListWarehouseResponse>;
  abstract create(warehouse: any): Observable<any>;
  abstract update(warehouse: any): Observable<any>;
  abstract delete(warehouse: any): Observable<any>;
}
