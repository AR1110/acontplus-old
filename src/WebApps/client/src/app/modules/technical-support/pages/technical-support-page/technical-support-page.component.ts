import { Component, ViewChild } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from '@modules/technical-support/components/dashboard/dashboard.component';
import { OrderListComponent } from '../order-page/order-list/order-list.component';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import {MatCard, MatCardContent} from "@angular/material/card"; ;

@Component({
    selector: 'app-technical-support-page',
    imports: [
        BreadcrumbComponent,
        DashboardComponent,
        NgbNavModule,
        OrderListComponent,
        MatCard,
        MatCardContent,
    ],
    templateUrl: './technical-support-page.component.html',
    styles: ``
})
export class TechnicalSupportPageComponent {
  @ViewChild(OrderListComponent) child!: OrderListComponent;
  active = 2;
}
