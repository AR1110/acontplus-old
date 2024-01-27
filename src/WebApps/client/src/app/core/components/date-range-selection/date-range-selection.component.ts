import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  inject
} from "@angular/core";
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import { FormControl } from "@angular/forms";

import { debounceTime, takeWhile } from "rxjs/operators";
import { AppModule } from "src/app/app.module";

declare var DateRangePicker: any;
import moment from 'moment';
import { formatDateMoment } from "@core/utils/format-date-moment";
import { isDatesEqual } from "@core/utils/is-dates-equal";

@Component({
  selector: 'app-date-range-selection',
  standalone: true,
  imports: [AppModule],
  templateUrl: './date-range-selection.component.html',
})
export class DateRangeSelectionComponent {
  @Output() onChangeDateRange = new EventEmitter<{ from: string, to: string }>();

  @ViewChild('dateRangeInput', { static: false }) dateRangeInput!: ElementRef;

  ngAfterViewInit() {
    const self = this;
      const valorInput = this.dateRangeInput.nativeElement;
    (function (DateRangePicker) {
      let drp = new DateRangePicker(valorInput,
        {
          //startDate: '2000-01-01',
          //endDate: '2000-01-03',
          //minDate: '2021-07-15 15:00',
          //maxDate: '2021-08-16 15:00',
          //maxSpan: { "days": 9 },
          //showDropdowns: true,
          //minYear: 2020,
          //maxYear: 2022,
          //showWeekNumbers: true,
          //showISOWeekNumbers: true,
          timePicker: false,
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
          ranges: {
            'Hoy': [moment(), moment()],
            'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Últimos 5 días': [moment().subtract(4, 'days'), moment()],
            'Últimos 10 días': [moment().subtract(9, 'days'), moment()],
            'Ultimos 15 Días': [moment().subtract(14, 'days'), moment()],
            'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
            'Este Mes': [moment().startOf('month'), moment().endOf('month')],
            'El mes pasado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
          },
          locale: {
            applyLabel: "Aplicar",
            cancelLabel: 'Cancelar',
            customRangeLabel: 'Rango Personalizado',
            separator: ' - ',
            format: "YYYY-MM-DD",
          }
        },
        function (start: any, end: any) {
          const currentDate = new Date();
          // if (isDatesEqual(new Date(start), new Date())) {
          //   start.setHours(
          //     currentDate.getHours(),
          //     currentDate.getMinutes(),
          //     currentDate.getSeconds(),
          //     currentDate.getMilliseconds()
          //   );
          // }
          // if (isDatesEqual(end, new Date())) {
          //   end.setHours(
          //     currentDate.getHours(),
          //     currentDate.getMinutes(),
          //     currentDate.getSeconds(),
          //     currentDate.getMilliseconds()
          //   );
          // }
          const dateRange = {
            from: formatDateMoment(new Date(start)),
            to: formatDateMoment(new Date(end)),
          };
          self.onChangeDateRange.emit(dateRange);
        })
      //drp.setStartDate('2014/03/01');
      //drp.setEndDate('2014/03/03');
      window.addEventListener('apply.daterangepicker', function (ev: any) {
        // const startDate = ev.detail.startDate
        // const endDate = ev.detail.startDate;

      });
    })(DateRangePicker);
  }
}
