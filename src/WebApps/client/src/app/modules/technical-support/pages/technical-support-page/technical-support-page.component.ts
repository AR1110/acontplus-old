import { Component, computed, signal } from '@angular/core';
import { DashboardComponent } from '@modules/technical-support/components/dashboard/dashboard.component';
import { OrderListComponent } from '../order-page/order-list/order-list.component';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DynamicCard } from '@acontplus/ng-components';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-technical-support-page',
  imports: [
    BreadcrumbComponent,
    DashboardComponent,
    OrderListComponent,
    DynamicCard,
    MatTabsModule,
  ],
  templateUrl: './technical-support-page.component.html',
  styles: ``,
})
export class TechnicalSupportPageComponent {
  active = computed(() => {
    return this.selected() + 1;
  });

  selected = signal(1);

  selectedIndexChange($event: number) {
    this.selected.set($event);
  }
}
