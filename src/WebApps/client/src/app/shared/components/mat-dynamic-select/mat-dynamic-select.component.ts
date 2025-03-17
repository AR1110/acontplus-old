import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  output,
  ViewChild,
} from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AsyncPipe } from '@angular/common';
import { SelectOption } from '@shared/models/select-option';

@Component({
  selector: 'app-mat-dynamic-select',
  imports: [
    MatFormField,
    NgxMatSelectSearchModule,
    AsyncPipe,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './mat-dynamic-select.component.html',
  styles: `
    .mat-form-field {
      width: 100%;
    }
  `,
})
export class MatDynamicSelectComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  label = input<string>('Seleccione una opción');
  options = input.required<SelectOption[]>();
  selectedValue = input<any>();

  selectionChange = output<any>();

  public selectControl: FormControl = new FormControl();
  public selectFilterControl: FormControl = new FormControl();
  public filteredOptions: ReplaySubject<SelectOption[]> = new ReplaySubject<
    SelectOption[]
  >(1);

  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;
  @ViewChild('singleSelect', { read: ElementRef })
  public singleSelectRef!: ElementRef;

  protected _onDestroy = new Subject<void>();

  ngOnInit() {
    this.filteredOptions.next(this.options().slice());

    this.selectFilterControl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOptions();
      });

    if (this.selectedValue) {
      this.selectControl.setValue(this.selectedValue);
    }

    this.selectControl.valueChanges.subscribe((value) => {
      this.selectionChange.emit(value);
    });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected setInitialValue() {
    this.filteredOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: SelectOption, b: SelectOption) =>
          a && b && a.value === b.value;
      });
  }

  protected filterOptions() {
    if (!this.options) {
      return;
    }

    let search = this.selectFilterControl.value;
    if (!search) {
      this.filteredOptions.next(this.options().slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredOptions.next(
      this.options().filter(
        (option) => option.viewValue.toLowerCase().indexOf(search) > -1,
      ),
    );
  }
}
