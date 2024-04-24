import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { SupportPageComponent } from '@modules/mechanical/pages/support-page/support-page.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mechanical-layout',
  standalone: true,
  imports: [
    CommonModule,
    NgbNavModule,
    BreadcrumbComponent,
    SupportPageComponent,
  ],
  templateUrl: './mechanical-layout.component.html',
  styleUrl: './mechanical-layout.component.css',
})
export class MechanicalLayoutComponent implements OnInit {
  active = 1;
  ngOnInit(): void { }


  onShown($event: any){
    console.log($event)

  }

}
