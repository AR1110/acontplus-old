import { Observable } from 'rxjs';
import { SupplierSearch } from '@customer/core/domain/supplier.interface';

export abstract class SupplierRepository {
  abstract search<T extends { textSearch: string }>(
    obj: T,
  ): Observable<SupplierSearch[]>;
}
