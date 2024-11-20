import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MECHANICAL_STATUS } from '@modules/mechanical/enums/mechanical.enum';
import { InspectionPageComponent } from '@modules/mechanical/pages/inspection-page/inspection-page.component';
import { MechanicalDashboardComponent } from '@modules/mechanical/pages/mechanical-dashboard/mechanical-dashboard.component';
import { SupportPageComponent } from '@modules/mechanical/pages/support-page/support-page.component';
import { SupportService } from '@modules/mechanical/services/support.service';
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

  supportSvc = inject(SupportService);
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
