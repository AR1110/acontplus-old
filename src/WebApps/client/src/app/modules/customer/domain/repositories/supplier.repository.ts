import { Observable } from 'rxjs';
import { SupplierSearch } from '@customer/domain/models/supplier.interface';

export abstract class SupplierRepository {
  abstract search<T extends { textSearch: string }>(obj: T): Observable<SupplierSearch[]>;
}
