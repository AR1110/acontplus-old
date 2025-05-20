import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  output,
  ViewChild,
  effect,
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

  constructor() {
    // Use effect to watch for changes in selectedValue input
    effect(() => {
      const value = this.selectedValue();
      if (value !== undefined && value !== null) {
        // Find the complete option object that matches the selected value
        const selectedOption = this.options().find(
          (option) =>
            option.value === value ||
            (typeof value === 'object' && option.value === value.value),
        );

        if (selectedOption && this.selectControl.value !== selectedOption) {
          this.selectControl.setValue(selectedOption, { emitEvent: false });
        }
      }
    });

    // Use effect to watch for changes in options input
    effect(() => {
      const options = this.options();
      if (options) {
        this.filteredOptions.next(options.slice());
      }
    });
  }

  ngOnInit() {
    this.filteredOptions.next(this.options().slice());

    this.selectFilterControl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOptions();
      });

    this.selectControl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe((selectedOption: SelectOption) => {
        // Emit the actual value, not the entire option object
        if (selectedOption && selectedOption.value !== undefined) {
          this.selectionChange.emit(selectedOption.value);
        } else {
          this.selectionChange.emit(selectedOption);
        }
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
        // Set compareWith to compare the actual SelectOption objects
        this.singleSelect.compareWith = (a: SelectOption, b: SelectOption) => {
          if (!a || !b) return false;
          return a.value === b.value;
        };
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

    const filtered = this.options().filter(
      (option) => option.viewValue.toLowerCase().indexOf(search) > -1,
    );

    // Always include the currently selected option in the filtered results
    // to prevent the select from losing its value
    const currentSelectedOption = this.selectControl.value;
    if (
      currentSelectedOption &&
      !filtered.find((option) => option.value === currentSelectedOption.value)
    ) {
      // Add the currently selected option at the beginning
      filtered.unshift(currentSelectedOption);
    }

    this.filteredOptions.next(filtered);
  }
}
