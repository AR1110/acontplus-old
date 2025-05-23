import {Component, signal} from '@angular/core';
import {BreadcrumbComponent} from "@core/components/breadcrumb/breadcrumb.component";
import {MatDynamicCardComponent} from "@shared/components/mat-dynamic-card/mat-dynamic-card.component";

@Component({
  selector: 'app-payments-report',
  imports: [
    BreadcrumbComponent,
    MatDynamicCardComponent
  ],
  templateUrl: './payments-report.component.html',
  styles: ``
})
export class PaymentsReportComponent {


  reportTypes = signal([
    {code: 'RG', name: 'Reporte General'},
    {code: 'R', name: 'Reporte Cuenta por Cobrar'},
  ])

}
