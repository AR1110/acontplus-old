import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-custom-date-range',
  standalone: true,
  imports: [NgbDatepickerModule, FormsModule, JsonPipe, FontAwesomeModule],
  templateUrl: './custom-date-range.component.html',
  styleUrl: './custom-date-range.component.scss',
})
export class CustomDateRangeComponent {
  @Output() onChangeDateRange = new EventEmitter<{
    fromDate: any;
    toDate: any;
  }>();

  calendar = inject(NgbCalendar);
  formatter = inject(NgbDateParserFormatter);

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = this.calendar.getToday();
  toDate: NgbDate | null = this.calendar.getNext(
    this.calendar.getToday(),
    'd',
    10
  );

  ngAfterViewInit() {
    this.onChangeDateRange.emit({
      fromDate: this.formatter.format(this.fromDate),
      toDate: this.formatter.format(this.toDate),
    });
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.after(this.fromDate)
    ) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    this.onChangeDateRange.emit({
      fromDate: this.formatter.format(this.fromDate),
      toDate: this.formatter.format(this.toDate),
    });
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(
    currentValue: NgbDate | null,
    input: string,
    tipoFecha: 'fromDate' | 'toDate'
  ): NgbDate | null {
    const parsed = this.formatter.parse(input);
    // let fromDate = this.formatter.format(this.fromDate);
    // let toDate = this.formatter.format(this.toDate);

    this.onChangeDateRange.emit({
      fromDate:
        tipoFecha === 'fromDate' ? input : this.formatter.format(this.fromDate),
      toDate:
        tipoFecha === 'toDate' ? input : this.formatter.format(this.toDate),
    });
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }
}
