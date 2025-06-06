import {Component, signal} from '@angular/core';
import {BreadcrumbComponent} from "@core/components/breadcrumb/breadcrumb.component";
import {MatDynamicCardComponent} from "@shared/components/mat-dynamic-card/mat-dynamic-card.component";
import {MatRadioModule} from "@angular/material/radio";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {DateRangeSelectionComponent} from "@core/components/date-range-selection/date-range-selection.component";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatDivider} from "@angular/material/divider";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {SvgIconComponent} from "@shared/components/svg-icon/svg-icon.component";

@Component({
  selector: 'app-payments-report',
  imports: [
    BreadcrumbComponent,
    MatDynamicCardComponent,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DateRangeSelectionComponent,
    MatCheckbox,
    MatDivider,
    ThemeButtonComponent,
    SvgIconComponent
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
