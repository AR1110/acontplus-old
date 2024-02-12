import { NgModule } from "@angular/core";
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { SupplierSearchDirective } from "./directives/purchase.directive";
import { CustomDateRangeComponent } from "@core/components/custom-date-range/custom-date-range.component";
import { SupplierSearchComponent } from "./components/supplier-search/supplier-search.component";
import { DateRangeSelectionComponent } from "@core/components/date-range-selection/date-range-selection.component";
@NgModule({
  imports: [
    BreadcrumbComponent,
    CustomDateRangeComponent,
    SupplierSearchComponent,
    DateRangeSelectionComponent,
    SupplierSearchDirective,
  ],
  exports: [
    BreadcrumbComponent,
    CustomDateRangeComponent,
    SupplierSearchComponent,
    DateRangeSelectionComponent,
    SupplierSearchDirective
  ]
})

export class PurchaseModule { }


