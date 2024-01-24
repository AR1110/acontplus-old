import { NgModule } from "@angular/core";
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { SupplierSearchDirective } from "./directives/purchase.directive";
import { CustomDateRangeComponent } from "@core/components/custom-date-range/custom-date-range.component";
@NgModule({
  imports: [
    BreadcrumbComponent,
    CustomDateRangeComponent,
    SupplierSearchDirective,
  ],
  exports: [
    BreadcrumbComponent,
    CustomDateRangeComponent,
    SupplierSearchDirective
  ]
})

export class PurchaseModule { }


