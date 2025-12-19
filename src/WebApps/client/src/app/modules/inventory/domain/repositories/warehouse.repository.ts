import { Observable } from 'rxjs';
import { ListWarehouseResponse } from '@inventory/domain/models/warehouse.model';

export interface WarehouseRepository {
  list(params: any): Observable<ListWarehouseResponse>;
  create(warehouse: any): Observable<any>;
  update(warehouse: any): Observable<any>;
  delete(warehouse: any): Observable<any>;
}
