import { NgModule } from "@angular/core";
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { SupplierSearchDirective } from "./directives/purchase.directive";
@NgModule({
  imports: [
    BreadcrumbComponent,
    SupplierSearchDirective
  ],
  exports: [
    BreadcrumbComponent,
    SupplierSearchDirective
  ]
})

export class PurchaseModule { }


