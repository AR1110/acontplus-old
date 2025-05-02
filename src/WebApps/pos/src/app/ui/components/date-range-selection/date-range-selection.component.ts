import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter, input,
  Input, model,
  output,
  Output,
  ViewChild,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {
  formatDateToString,
  zonaHorariaEcuador,
} from '@domain/utils/date.util';
import {
  addDay,
  format,
  monthEnd,
  monthStart,
  weekEnd,
  weekStart,
} from '@formkit/tempo';
import {MatCheckbox} from "@angular/material/checkbox";
declare var DateRangePicker: any;

@Component({
  selector: 'app-date-range-selection',
  imports: [FormsModule, MatInputModule, MatCheckbox],
  template: `
    <mat-form-field class="w-100" [floatLabel]="'always'">
    <mat-label>Rango Fecha</mat-label>
    <input
      matInput
      placeholder="Placeholder"
      id="date-range-selection-input"
      #dateRangeInput
    />
    <ng-container matSuffix>
      <mat-checkbox [ngModel]="enableDateFilter"
                    (change)="emitDateFilterChange($event)"
                    (click)="$event.stopPropagation()"
      ></mat-checkbox>
    </ng-container>
  </mat-form-field> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangeSelectionComponent {
  @Input() enableDateFilter = false;
  enableDateFilterChange = output<any>()
  @Input() from: string | null = null;
  @Input() to: string | null = null;

  @Input() options = {
    timePicker: false,
    format: 'YYYY-MM-DD',
  };

  private currentDate = new Date();
  private formatCurrentDate = format({
    date: this.currentDate,
    format: 'YYYY-MM-DD HH:mm:ss',
    tz: zonaHorariaEcuador,
  });
  onChangeDateRange = output<{ from: string; to: string }>();

  @ViewChild('dateRangeInput', { static: false }) dateRangeInput!: ElementRef;

  private getDateAddDay(day: number) {
    return addDay(this.currentDate, day);
  }

  emitDateFilterChange($event:any){
    this.enableDateFilterChange.emit($event.checked);
  }

  ngAfterViewInit() {
    const self = this;
    const rangos = {
      Hoy: [self.formatCurrentDate, self.formatCurrentDate],
      Ayer: [self.getDateAddDay(-1), self.getDateAddDay(-1)],
      'Últimos 5 días': [self.getDateAddDay(-4), self.formatCurrentDate],
      'Últimos 10 días': [self.getDateAddDay(-9), self.formatCurrentDate],
      'Últimos 15 días': [self.getDateAddDay(-14), self.formatCurrentDate],
      'Últimos 30 días': [self.getDateAddDay(-29), self.formatCurrentDate],
      'Esta semana': [weekStart(self.currentDate), weekEnd(self.currentDate)],
      'Última semana': [
        weekStart(weekStart(this.currentDate, -1)),
        weekStart(this.currentDate, -1),
      ],
      'Este mes': [monthStart(self.currentDate), monthEnd(self.currentDate)],
      'El mes pasado': [
        monthStart(addDay(monthStart(this.currentDate), -1)),
        addDay(monthStart(this.currentDate), -1),
      ],
    };
    const valorInput = this.dateRangeInput.nativeElement;
    (function (DateRangePicker) {
      let drp = new DateRangePicker(
        valorInput,
        {
          startDate: self.from ? self.from : undefined,
          endDate: self.to ? self.to : undefined,
          //minDate: '2021-07-15 15:00',
          //maxDate: '2021-08-16 15:00',
          //maxSpan: { "days": 9 },
          showDropdowns: true,
          minYear: 2020,
          //maxYear: 2022,
          //showWeekNumbers: true,
          //showISOWeekNumbers: true,
          timePicker: self.options.timePicker,
          //timePickerIncrement: 10,
          //timePicker24Hour: true,
          //timePickerSeconds: true,
          //showCustomRangeLabel: false,
          alwaysShowCalendars: true,
          //opens: 'center',
          //drops: 'up',
          //singleDatePicker: true,
          //autoApply: true,
          //linkedCalendars: false,
          //isInvalidDate: function(m){
          //    return m.weekday() == 3;
          //},
          //isCustomDate: function(m){
          //    return "weekday-" + m.weekday();
          //},
          //autoUpdateInput: false,
          ranges: rangos,
          locale: {
            applyLabel: 'Aplicar',
            cancelLabel: 'Cancelar',
            customRangeLabel: 'Rango Personalizado',
            separator: ' - ',
            format: self.options.format,
          },
        },
        function (start: any, end: any) {
          const dateRange = {
            from: formatDateToString(new Date(start)),
            to: formatDateToString(new Date(end)),
          };
          self.onChangeDateRange.emit(dateRange);
        }
      );
      //drp.setStartDate('2014/03/01');
      //drp.setEndDate('2014/03/03');
      window.addEventListener('apply.daterangepicker', function (ev: any) {
        // const startDate = ev.detail.startDate
        // const endDate = ev.detail.startDate;
      });
    })(DateRangePicker);

    //  document.getElementById("date-range-selection-input")?.click()
  }
}
