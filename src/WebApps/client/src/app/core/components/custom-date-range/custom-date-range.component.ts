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

@Component({
  selector: 'app-custom-date-range',
  standalone: true,
  imports: [AppModule],
  templateUrl: './custom-date-range.component.html',
  styles: `.custom-day {
      text-align: center;
      padding: 0.185rem 0.25rem;
      display: inline-block;
      height: 2rem;
      width: 2rem;
    }
    .custom-day.focused {
      background-color: #e6e6e6;
    }
    .custom-day.range, .custom-day:hover {
      background-color: rgb(2, 117, 216);
      color: white;
    }
    .custom-day.faded {
      background-color: rgba(2, 117, 216, 0.5);
    }
    .ngb-datepicker {

    border-color: transparent;
    border-radius: 0;
    display: inline-block;

}`
})
export class CustomDateRangeComponent {
  @Output() onChangeDateRange = new EventEmitter<{ from: string, to: string }>();
  private formatter = inject(NgbDateParserFormatter);

  @ViewChild("rangeID", { static: false, read: ElementRef })
  rangeInput!: ElementRef;
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  range: FormControl = new FormControl();
  alive: boolean = true;

  constructor(calendar: NgbCalendar) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), "d", 10);
  }
  ngOnInit() {
    this.range.setValue(this.formatRange(this.fromDate, this.toDate));
    this.range.valueChanges
      .pipe(
        takeWhile(() => this.alive),
        debounceTime(500)
      )
      .subscribe(res => this.change(res));
    this.emit()
  }
  ngOnDestroy() {
    this.alive = false;
  }
  open(isOpen: boolean, dp: any) {
    if (isOpen) {
      console.log(dp.navigateTo(this.fromDate));
    }
  }
  change = (range: string) => {
    // let start = this.rangeInput.nativeElement.selectionStart;
    let value = range.replace(/[^0-9]+/g, "").split("").slice(0, 16);
    let valueJoin = value.join("");
    let valueFormated = "";
    let fromDate: any = null;
    let toDate: any = null;

    if (value.length >= 8)
      fromDate = new NgbDate(
        +valueJoin.substring(0, 4),
        +valueJoin.substring(4, 6),
        +valueJoin.substring(6, 8)
      );

    if (value.length == 16)
      toDate = new NgbDate(
        +valueJoin.substring(8, 12),
        +valueJoin.substring(12, 14),
        +valueJoin.substring(14)
      );

    value.forEach((c, index) => {
      valueFormated += c;
      switch (index) {
        case 3:
        case 5:
        case 11:
        case 13:
          valueFormated += "-";
          break;
        case 7:
          valueFormated += " a ";
      }
    });
    this.range.setValue(valueFormated, { emitEvent: false });
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.emit()
  }
  onDateSelection(date: any, drop: any) {
    console.log(date)
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      // this.emit()
      drop.close();
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    this.range.setValue(this.formatRange(this.fromDate, this.toDate));
  }

  private emit(close?: boolean) {
    const dateRange = {
      from: this.formatter.format(this.fromDate),
      to: this.formatter.format(this.toDate),
    };
    this.onChangeDateRange.emit(dateRange);

    // if (close) {
    //   this.isOpen = false;
    //   this.datePicker.close();
    // }
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
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      date.equals(this.toDate) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }
  formatRange(fromDate: any, toDate: any) {
    return (
      (fromDate
        ? "" +
        fromDate.year +
        "-" +
        ("00" + fromDate.month).slice(-2) +
        "-" +
        ("00" + fromDate.day).slice(-2)
        : "") +
      " a " +
      (toDate
        ? "" +
        toDate.year +
        "-" +
        ("00" + toDate.month).slice(-2) +
        "-" +
        ("00" + toDate.day).slice(-2)
        : "")
    );
  }
}
