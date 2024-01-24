import { NgModule } from "@angular/core";
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { PrimaryStatusPipe } from "@shared/pipe/primary-status.pipe";
@NgModule({
  imports: [
    BreadcrumbComponent,
    PrimaryStatusPipe
  ],
  exports: [
    BreadcrumbComponent,
    PrimaryStatusPipe
  ]
})

export class InventoryModule { }


