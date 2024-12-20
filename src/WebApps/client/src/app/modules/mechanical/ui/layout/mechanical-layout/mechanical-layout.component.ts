import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MECHANICAL_STATUS } from '@mechanical/domain/enums/mechanical.enum';
import { InspectionPageComponent } from '@mechanical/ui/pages/inspection-page/inspection-page.component';
import { MechanicalDashboardComponent } from '@mechanical/ui/pages/mechanical-dashboard/mechanical-dashboard.component';
import { SupportPageComponent } from '@mechanical/ui/pages/support-page/support-page.component';
import { SupportWebRepository } from '@mechanical/data/support/support-web.repository';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-mechanical-layout',
    imports: [
        CommonModule,
        NgbNavModule,
        BreadcrumbComponent,
        MechanicalDashboardComponent,
        SupportPageComponent,
        InspectionPageComponent
    ],
    templateUrl: './mechanical-layout.component.html',
    styleUrl: './mechanical-layout.component.scss'
})
export class MechanicalLayoutComponent implements OnInit {


  statusTab = MECHANICAL_STATUS


  valueStatus  = this.statusTab.PENDIENTE

  supportSvc = inject(SupportWebRepository);
  supportStatus: any[] = [];
  supportStatusId = null;
  ngOnInit(): void {
    this.supportSvc.getDataFilter().subscribe(response => {
      this.supportStatus = response;
    })

  }


  onShown($event: any) {

  }

}
