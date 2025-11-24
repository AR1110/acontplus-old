import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { InspectionPageComponent } from '@mechanical/ui/pages/inspection-page/inspection-page.component';
import { MechanicalDashboardComponent } from '@mechanical/ui/pages/mechanical-dashboard/mechanical-dashboard.component';
import { SupportPageComponent } from '@mechanical/ui/pages/support-page/support-page.component';
import { MechanicalStore } from '@mechanical/application/store/mechanical.store';
import { DynamicCard } from '@acontplus/ng-components';
import { MatTabsModule } from '@angular/material/tabs';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-mechanical-layout',
  imports: [
    BreadcrumbComponent,
    MechanicalDashboardComponent,
    SupportPageComponent,
    InspectionPageComponent,
    DynamicCard,
    MatTabsModule,
    NgTemplateOutlet,
  ],
  templateUrl: './mechanical-layout.component.html',
})
export class MechanicalLayoutComponent {
  store = inject(MechanicalStore);
}
