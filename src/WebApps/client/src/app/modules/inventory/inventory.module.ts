import { NgModule } from "@angular/core";
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { PrimaryStatusPipe } from "@shared/pipe/primary-status.pipe"; 
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
@NgModule({
  imports: [
    FontAwesomeModule,
    BreadcrumbComponent,
    PrimaryStatusPipe,

    //Directives
  ],
  exports: [
    FontAwesomeModule,
    BreadcrumbComponent,
    PrimaryStatusPipe,

    //Directives
  ]
})

export class InventoryModule { }


