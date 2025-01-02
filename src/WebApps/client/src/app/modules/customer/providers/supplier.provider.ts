import { ClassProvider } from '@angular/core';
import { SupplierRepository } from '@customer/core/repositories/supplier.repository';
import { SupplierWebRepository } from '@customer/data/supplier/supplier-web.repository';

export const supplierProvider: ClassProvider = {
  provide: SupplierRepository,
  useClass: SupplierWebRepository,
};
