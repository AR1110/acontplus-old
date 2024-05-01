import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { InspectionPageComponent } from '@modules/mechanical/pages/inspection-page/inspection-page.component';
import { MechanicalDashboardComponent } from '@modules/mechanical/pages/mechanical-dashboard/mechanical-dashboard.component';
import { SupportPageComponent } from '@modules/mechanical/pages/support-page/support-page.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mechanical-layout',
  standalone: true,
  imports: [
    CommonModule,
    NgbNavModule,
    BreadcrumbComponent,
    MechanicalDashboardComponent,
    SupportPageComponent,
    InspectionPageComponent
  ],
  templateUrl: './mechanical-layout.component.html',
  styleUrl: './mechanical-layout.component.scss',
})
export class MechanicalLayoutComponent implements OnInit {
  active = 0;
  ngOnInit(): void { }


  onShown($event: any){
    console.log($event)

  }

}
