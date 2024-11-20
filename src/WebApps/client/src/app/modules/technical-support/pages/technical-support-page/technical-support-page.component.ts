import { Component, ViewChild } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from '@modules/technical-support/components/dashboard/dashboard.component';
import { OrderListComponent } from '../order-page/order-list/order-list.component';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { RouterLink } from '@angular/router';
import { ActionAddDirective } from '@shared/directives/permission/action-add.directive';

@Component({
    selector: 'app-technical-support-page',
    imports: [
        RouterLink,
        BreadcrumbComponent,
        DashboardComponent,
        NgbNavModule,
        OrderListComponent,
        ActionAddDirective,
    ],
    templateUrl: './technical-support-page.component.html',
    styles: ``
})
export class TechnicalSupportPageComponent {
  @ViewChild(OrderListComponent) child!: OrderListComponent;
  active = 2;
}
